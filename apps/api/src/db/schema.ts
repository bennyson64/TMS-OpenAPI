import {pgTable, text, uuid} from 'drizzle-orm/pg-core'

export const tasks = pgTable("tasks",{
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
})