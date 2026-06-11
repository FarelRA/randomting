import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from '../../drizzle/schema'

export { schema }

const client = createClient({
  url: process.env.DB_URL || 'file:./data/sqlite.db',
})

export const db = drizzle(client, { schema })
