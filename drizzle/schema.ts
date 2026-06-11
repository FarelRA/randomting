import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  username: text('username').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('user').notNull(),
  createdAt: integer('created_at').notNull(),
})

export const presets = sqliteTable('presets', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  toolSlug: text('tool_slug').notNull(),
  name: text('name').notNull(),
  config: text('config').notNull(),
  createdAt: integer('created_at').notNull(),
})

export const history = sqliteTable('history', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  toolSlug: text('tool_slug').notNull(),
  input: text('input').notNull(),
  result: text('result').notNull(),
  createdAt: integer('created_at').notNull(),
})

export const jokes = sqliteTable('jokes', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  category: text('category').default('general'),
  source: text('source'),
  active: integer('active').default(1).notNull(),
  createdAt: integer('created_at').notNull(),
})

export const facts = sqliteTable('facts', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  category: text('category').default('general'),
  source: text('source'),
  active: integer('active').default(1).notNull(),
  createdAt: integer('created_at').notNull(),
})

export const quotes = sqliteTable('quotes', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  author: text('author').notNull(),
  category: text('category').default('general'),
  source: text('source'),
  active: integer('active').default(1).notNull(),
  createdAt: integer('created_at').notNull(),
})

export const rooms = sqliteTable('rooms', {
  id: text('id').primaryKey(),
  hostId: text('host_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  tool: text('tool').notNull(),
  config: text('config').notNull(),
  status: text('status').default('waiting').notNull(),
  maxPlayers: integer('max_players').default(10).notNull(),
  createdAt: integer('created_at').notNull(),
})
