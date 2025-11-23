import { fastify } from 'fastify'
import { 
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider

 } from 'fastify-type-provider-zod'
 import { fastifySwagger } from '@fastify/swagger'
 import { fastifyCors } from '@fastify/cors'
 // Remova o import do Scalar aqui
import { listWebhooks } from './routes/get-webhooks'
import { getWebhook } from './routes/get-webhook'
import { env } from './env'
import { deleteWebhook } from './routes/delete-webhook'
import { captureWebhook } from './routes/capture-webhook'
import { generateHandler } from './routes/generate-handler'

async function startServer() {
  const app = fastify().withTypeProvider<ZodTypeProvider>()

  app.register(fastifyCors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Webhook Inspector API',
        description: 'API for capturing and inspecting webhook requests/events',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  })

  // Carrega o Scalar dinamicamente
  const { default: ScalarApiReference } = await import('@scalar/fastify-api-reference')
  
  app.register(ScalarApiReference, {
    routePrefix: '/docs',
  })

  app.register(listWebhooks)
  app.register(getWebhook)
  app.register(deleteWebhook)
  app.register(captureWebhook)
  app.register(generateHandler)

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  await app.listen({
    host: '0.0.0.0',
    port: env.PORT,
  })

  console.log('🔥 HTTP server running on http://localhost:3333')
  console.log('📚 Docs available at http://localhost:3333/docs')
}

startServer().catch((err) => {
  console.error('Error starting server:', err)
  process.exit(1)
})