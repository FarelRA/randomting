import { db, schema } from '../../utils/db'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const conditions = [eq(schema.jokes.active, 1)]
  if (query.category && query.category !== 'all') {
    conditions.push(eq(schema.jokes.category, query.category as string))
  }
  const all = await db.select().from(schema.jokes).where(and(...conditions))
  if (all.length === 0) return { content: 'No jokes available right now.' }
  const pick = all[Math.floor(Math.random() * all.length)]
  return { id: pick.id, content: pick.content, category: pick.category, source: pick.source }
})
