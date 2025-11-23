import { db } from './'
import { webhooks } from './schema'

async function seed() {
  await db.delete(webhooks)

  console.log('Database cleared.')

  const stripeEventTypes = [
    'charge.succeeded',
    'charge.failed',
    'customer.created',
    'customer.updated',
    'customer.deleted',
    'checkout.session.completed',
    'invoice.payment_succeeded',
    'invoice.payment_failed',
  ]

  const methods = ['POST']
  const pathnames = ['/v1/webhooks/stripe', '/v1/webhooks/legacy']
  const ips = ['192.168.1.1', '10.0.0.1', '172.16.0.1', '203.0.113.1']

  const generatedWebhooks = Array.from({ length: 60 }).map((_, i) => {
    const eventType = stripeEventTypes[i % stripeEventTypes.length]
    const method = methods[i % methods.length]
    const pathname = pathnames[i % pathnames.length]
    const ip = ips[i % ips.length]

    return {
      method,
      pathname,
      ip,
      statusCode: 200,
      contentType: 'application/json',
      contentLength: Math.floor(Math.random() * 1000) + 500,
      headers: {
        'user-agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)',
        'content-type': 'application/json; charset=utf-8',
        'stripe-signature': `v1=${Buffer.from(Math.random().toString()).toString('hex')}`,
      },
      body: JSON.stringify({
        id: `evt_${Buffer.from(Math.random().toString()).toString('base64')}`,
        object: 'event',
        api_version: '2020-08-27',
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            id: `ch_${Buffer.from(Math.random().toString()).toString('base64')}`,
            object: 'charge',
            amount: Math.floor(Math.random() * 10000) + 100,
            currency: 'usd',
            status: eventType.includes('failed') ? 'failed' : 'succeeded',
          },
        },
        livemode: false,
        pending_webhooks: 1,
        request: {
          id: `req_${Buffer.from(Math.random().toString()).toString('base64')}`,
          idempotency_key: null,
        },
        type: eventType,
      }, null, 2),
    }
  })

  await db.insert(webhooks).values(generatedWebhooks)

  console.log('Seed complete!')
}

seed().catch((err) => {
  console.error('Error during seeding:', err)
  process.exit(1)
})
