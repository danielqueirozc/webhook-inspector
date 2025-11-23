import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { createSelectSchema } from 'drizzle-zod'
import { webhooks } from "@/db/schema"
import { db } from "@/db"
import { eq } from "drizzle-orm"

export const deleteWebhook: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/api/webhooks/:id',
     { 
        schema: {
          summary: 'Delete a specific webhook by ID',
          tags: ['webhooks'], // criar ctegorias
          params: z.object({
            id: z.uuidv7()
          }),
          response: { // se sucesso
            204: z.void(), // quando nao retorna nada é 204
            404: z.object({message: z.string()})
          }
        }
     },
      async (request, reply) => {
        const { id } = request.params

        const result = await db
          .delete(webhooks)
          .where(eq(webhooks.id, id)) // eq = igual
          .returning() // retorna os dados do webhook, depois apaga

          return reply.status(204).send()
  })
}