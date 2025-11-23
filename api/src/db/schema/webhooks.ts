import { pgTable, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from 'uuidv7'

export const webhooks = pgTable("webhooks", {
  id: text().primaryKey().$default(() => uuidv7()),
  method: text().notNull(),
  pathname: text().notNull(),
  ip: text().notNull(),
  statusCode: integer().notNull().default(200),
  contentType: text(),
  contentLength: integer(),
  queryParams: jsonb().$type<Record<string, string>>(), // $type para tipar o jsonb, Record = objeto, chave string e valor string, tipar se nao o json vai ficar como any,
  headers: jsonb().$type<Record<string, string>>().notNull(),
  body: text(), // formato mais aberto, pois o usuario pode enviar arquivos etc...
  createdAt: timestamp().notNull().defaultNow(),
})