import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { workspace } from "./workspaces";

export const integration = pgTable("integration", {
  id: serial("id").primaryKey(),
  name: text("name", { length: 256 }).notNull(), // Should be vercel or other

  workspaceId: integer("workspace_id").references(() => workspace.id),

  // Not used yet but we might need to get store something for the integration  webhook url and or secret
  credential: text("credential", { mode: "json" }),

  externalId: text("external_id").notNull(), // the id of the integration in the external service

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),

  data: text("data", { mode: "json" }).notNull(),
});

export const insertIntegrationSchema = createInsertSchema(integration);
