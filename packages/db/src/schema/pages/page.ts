import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp
} from "drizzle-orm/pg-core";

import { maintenance } from "../maintenances";
import { monitorsToPages } from "../monitors";
import { pageSubscriber } from "../page_subscribers";
import { statusReport } from "../status_reports";
import { workspace } from "../workspaces";
import { pageAccessTypes } from "./constants";

export const page = pgTable("page", {
  id: serial("id").primaryKey(),

  workspaceId: integer("workspace_id")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),

  title: text("title").notNull(), // title of the page
  description: text("description").notNull(), // description of the page
  icon: text("icon").default(""), // icon of the page
  slug: text("slug").notNull().unique(), // which is used for https://slug.pingora.dev
  customDomain: text("custom_domain").notNull(),
  published: boolean("published").default(false),

  forceTheme: text("force_theme", { enum: ["dark", "light", "system"] })
    .notNull()
    .default("system"),

  // Password protecting the status page - no specific restriction on password
  password: text("password"),
  // @deprecated: instead, use accessType
  passwordProtected: boolean("password_protected").default(
    false,
  ),
  accessType: text("access_type", { enum: pageAccessTypes }).default("public"),
  authEmailDomains: text("auth_email_domains"), // TODO: change to json

  // links and urls
  homepageUrl: text("homepage_url"),
  contactUrl: text("contact_url"),

  legacyPage: boolean("legacy_page")
    .notNull()
    .default(true),
  configuration: text("configuration", { mode: "json" }),

  /**
   * Displays the total and failed request numbers for each monitor
   * TODO: remove this column - we moved into configuration
   */
  showMonitorValues: boolean("show_monitor_values").default(true),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const pageRelations = relations(page, ({ many, one }) => ({
  monitorsToPages: many(monitorsToPages),
  maintenances: many(maintenance),
  statusReports: many(statusReport),
  workspace: one(workspace, {
    fields: [page.workspaceId],
    references: [workspace.id],
  }),
  pageSubscribers: many(pageSubscriber),
}));
