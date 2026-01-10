import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp
} from "drizzle-orm/pg-core";

import { page } from "../pages";

export const pageSubscriber = pgTable("page_subscriber", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),

  pageId: integer("page_id")
    .notNull()
    .references(() => page.id, { onDelete: "cascade" }),

  token: text("token"),
  acceptedAt: timestamp("accepted_at", { mode: "date" }),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const pageSubscriberRelation = relations(pageSubscriber, ({ one }) => ({
  page: one(page, {
    fields: [pageSubscriber.pageId],
    references: [page.id],
  }),
}));
