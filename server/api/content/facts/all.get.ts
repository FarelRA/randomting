import { db, schema } from '../../../utils/db'

export default defineEventHandler(async () => {
  return await db.select().from(schema.facts).orderBy(schema.facts.createdAt)
})
