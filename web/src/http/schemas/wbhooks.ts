import { uuidv7, z } from 'zod'

export const WebHookListItemSchema = z.object({
	id: z.uuidv7(),
	method: z.string(),
	pathname: z.string(),
	createdAt: z.coerce.date(),
})

export const WebHookListSchema = z.object({
	webhooks: z.array(WebHookListItemSchema),
	nextCursor: z.string().nullable(),
})

export const webhookDetailsSchema = z.object({
	id: uuidv7(),
	method: z.string(),
	pathname: z.string(),
	createdAt: z.coerce.date(),
	ip: z.string(),
	statusCode: z.number(),
	headers: z.record(z.string(), z.string()),
	contentType: z.string().nullable(),
	contentLength: z.number().nullable(),
	queryParams: z.record(z.string(), z.string()).nullable(),
	body: z.string().nullable(),
})
