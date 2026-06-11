import { db, schema } from '../../../utils/db'

export default defineEventHandler(async () => {
  return await db.select().from(schema.quotes).orderBy(schema.quotes.createdAt)
})
