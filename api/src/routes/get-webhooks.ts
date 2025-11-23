import { db } from "@/db"
import { webhooks } from "@/db/schema"
import { desc, lt } from "drizzle-orm"
import { createSelectSchema } from "drizzle-zod"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

export const listWebhooks: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/webhooks',
     {
        schema: {
          summary: 'List webhooks',
          tags: ['webhooks'], // criar ctegorias
          querystring: z.object({
            limit: z.coerce.number().min(1).max(100).default(20),
            cursor: z.string().optional(),
          }),
          response: {
            200: z.object({
              webhooks: z.array(
              createSelectSchema(webhooks).pick({
                id: true,
                method: true,
                pathname: true,
                createdAt: true, 
              })
            ),
              nextCursor: z.string().nullable(),
            })
          },
        },
     },
      async (request, reply) => {
        const { limit, cursor } = request.query

       const result = await db
        .select({
          id: webhooks.id,
          method: webhooks.method,
          pathname: webhooks.pathname,
          createdAt: webhooks.createdAt,
        })
        .from(webhooks)
        .where(cursor ? lt(webhooks.id, cursor) : undefined) // less than > menor que / os menos sao os webhooks mais atuais, os maiores sao os mais antigos
        .orderBy(desc(webhooks.id))
        .limit(limit + 1) // para saber se tem uma outra pagina ou nao
        
        const hasMore = result.length > limit // verificando se passa do limit que é 20
        const items = hasMore ? result.slice(0, limit) : result // se for true eu quero um array do 0 até o limit que é 20
        const nextCursor = hasMore ? items[items.length - 1].id : null // items.length é para pegar o ultimo item

        return reply.send({
          webhooks: items,
          nextCursor,
        })
      },
  )
}