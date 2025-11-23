import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { webhooks } from "@/db/schema"
import { db } from "@/db"

export const captureWebhook: FastifyPluginAsyncZod = async (app) => {
  app.all(
    '/capture/*',
     { 
        schema: {
          summary: 'Capture incoming webhook requests',
          tags: ['External;'], // criar ctegorias
          hide: true, // nao aparecer na documentacao
          response: { // se sucesso
            201: z.object({ id: z.uuidv7() }), // como se fosse um z.object() com todas as colunas do banco de dados
          }
        }
     },
      async (request, reply) => {
        const method = request.method
        const pathname = new URL(request.url).pathname.replace('/capture', '' )
        const ip = request.ip
        const contentType = request.headers['content-type']
        const contentLength = request.headers['content-length'] ? Number(request.headers['content-length']) : null
        const headers = Object.fromEntries(
          Object.entries(request.headers).map(([key, value]) => [
            key,
            Array.isArray(value) ? value.join(', ') : value || '',
          ])
        
        )

        let body: string | null = null
        if (request.body) {
          body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body, null, 2)
        }

        const result = await db
        .insert(webhooks)
        .values({
          method,
          ip,
          contentType,
          contentLength,
          body,
          pathname,
          headers,
        })
        .returning()
        
        return reply.send({ id: result[0].id })
  })
}