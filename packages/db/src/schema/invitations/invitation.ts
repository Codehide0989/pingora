import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp
} from "drizzle-orm/pg-core";

import { workspace, workspaceRole } from "../workspaces";

export const invitation = pgTable("invitation", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  role: text("role", { enum: workspaceRole }).notNull().default("member"),
  workspaceId: integer("workspace_id").notNull(),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  acceptedAt: timestamp("accepted_at", { mode: "date" }),
});

export const invitationRelations = relations(invitation, ({ one }) => ({
  workspace: one(workspace, {
    fields: [invitation.workspaceId],
    references: [workspace.id],
  }),
}));
