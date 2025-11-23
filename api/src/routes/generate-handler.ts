import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { webhooks } from "@/db/schema"
import { db } from "@/db"
import { inArray } from "drizzle-orm"
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

export const generateHandler: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/api/generate',
     { 
        schema: {
          summary: 'Generate a TypeScript handler',
          tags: ['webhooks'], // criar ctegorias
          body: z.object({
            webhooksIds: z.array(z.string()),
          }),
          response: { // se sucesso
            201: z.object({
              code: z.string()
            }), // quando nao retorna nada é 204
          }
        }
     },
      async (request, reply) => {
        const { webhooksIds } = request.body

        const result = await db
          .select({ body: webhooks.body })
          .from(webhooks)
          .where(inArray(webhooks.id, webhooksIds)) // isso vai buscar todos os webhooks que tem o id dentro do array de webhooksIds 

          const webhooksBodies = result.map(webhook => webhook.body).join('\n\n') // junta todos os corpos dos webhooks em uma so string, separando por duas linhas

          // ai vercel          
          const { text } = await generateText({ 
           model: google('gemini-2.5-flash'),
            prompt: `
              You are an expert TypeScript developer tasked with creating a robust and type-safe webhook handler.

              Your goal is to generate a single TypeScript function that can process various incoming webhooks. You must use the Zod library to parse and validate the structure of each webhook payload.

              Based on the JSON examples provided below, you need to:

              Analyze the Payloads: Examine the structure of each JSON object to understand its fields and identify a common field that distinguishes the event type (e.g., event, type, event_name).

              Create Zod Schemas: For each distinct webhook event, define a Zod schema that matches its structure.

              Build a Discriminated Union: Combine the individual schemas into a single Zod discriminated union schema. This will allow you to parse different event types safely.

              Implement the Handler Function:

              Create an async function named handleWebhook.
              This function should accept one argument: payload: unknown.
              Inside the function, parse the payload using the discriminated union schema you created.
              Use a switch statement based on the event type discriminator.
              For each event type, add a case that logs a message to the console, like console.log('Received event: [EVENT_NAME]', data);.
              Here are the example webhook payloads:

              """
              ${webhooksBodies}
              """

              Please generate the complete TypeScript code for the handleWebhook function, including all necessary Zod schema definitions and imports.

              Return only the code and do not return \`\`\`typescript or any markdown symbols, do not include any introduction or text before or after the code.
            `.trim(),
          })

          return reply.status(201).send({ code: text })
  })
}