import { db, schema } from '../../../utils/db'

export default defineEventHandler(async () => {
  return await db.select().from(schema.jokes).orderBy(schema.jokes.createdAt)
})
