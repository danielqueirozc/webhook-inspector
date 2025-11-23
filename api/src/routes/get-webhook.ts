import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { createSelectSchema } from 'drizzle-zod'
import { webhooks } from "@/db/schema"
import { db } from "@/db"
import { eq } from "drizzle-orm"

export const getWebhook: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/webhooks/:id',
     { 
        schema: {
          summary: 'Get a specific webhook by ID',
          tags: ['webhooks'], // criar ctegorias
          params: z.object({
            id: z.uuidv7()
          }),
          response: { // se sucesso
            200: createSelectSchema(webhooks), // como se fosse um z.object() com todas as colunas do banco de dados
            404: z.object({message: z.string()})
          }
        }
     },
      async (request, reply) => {
        const { id } = request.params

        const result = await db
          .select()
          .from(webhooks)
          .where(eq(webhooks.id, id)) // eq = igual
          .limit(1) // limite de 1 resultado

          if (result.length === 0) {
            return reply.status(404).send({ message: 'Webhook not found' })
          }

          return reply.send(result[0]) // toda query ddo banco de dados sempre retorna um array
  })
}