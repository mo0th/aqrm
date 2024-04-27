import { relations } from 'drizzle-orm'
import { pgTable, uniqueIndex, pgEnum, text, boolean, timestamp } from 'drizzle-orm/pg-core'
import { createPrimaryKeyId } from '../cuid'

export const feedbackType = pgEnum('FeedbackType', ['ISSUE', 'IDEA', 'OTHER'])

export const user = pgTable(
  'user',
  {
    id: text('id').primaryKey().notNull(),
    name: text('name'),
    email: text('email').notNull(),
    picture: text('picture'),
  },
  table => {
    return {
      emailUnique: uniqueIndex('user.email_unique').on(table.email),
    }
  }
)

export const site = pgTable(
  'site',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .$defaultFn(() => createPrimaryKeyId()),
    name: text('name').notNull(),
    ownerId: text('ownerId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    allowFeedback: boolean('allowFeedback').default(true).notNull(),
    isPublic: boolean('isPublic').default(false).notNull(),
    createdAt: timestamp('createdAt', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull().defaultNow(),
  },
  table => {
    return {
      nameUnique: uniqueIndex('site.name_unique').on(table.name),
    }
  }
)

export const siteRelations = relations(site, ({ many }) => ({
  feedbacks: many(feedback),
}))

export const feedback = pgTable('feedback', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => createPrimaryKeyId()),
  type: feedbackType('type').notNull(),
  text: text('text').notNull(),
  siteId: text('siteId')
    .notNull()
    .references(() => site.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' }).defaultNow().notNull(),
  userId: text('userId'),
})

export const feedbackRelations = relations(feedback, ({ one }) => ({
  site: one(site, { fields: [feedback.siteId], references: [site.id] }),
}))
