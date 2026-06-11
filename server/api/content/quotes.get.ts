import { db, schema } from '../../utils/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const all = await db.select().from(schema.quotes).where(eq(schema.quotes.active, 1))
  if (all.length === 0) return { content: 'No quotes available right now.', author: '' }
  const pick = all[Math.floor(Math.random() * all.length)]
  return { id: pick.id, content: pick.content, author: pick.author, category: pick.category, source: pick.source }
})
