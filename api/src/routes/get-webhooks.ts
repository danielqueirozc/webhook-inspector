import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

export const ListWebhooks: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/hebhooks',
     {
        schema: {
          summary: 'List webhooks',
          tags: ['webhooks'], // criar ctegorias
          querystring: z.object({
            limit: z.coerce.number().min(1).max(100).default(20),
          }),
          response: {
            200: z.array(z.object({
              id: z.string(),
              method: z.string(),
            }))
          }
        }
     },
      async (request, reply) => {
        const { limit } = request.query

        return [
          {
            id: 'Daniel',
            method: 'POST'
          }
        ]
  })
}