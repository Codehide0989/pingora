import type { Workspace } from "@pingora/db/src/schema";
import type { RequestIdVariables } from "hono/request-id";

export type Variables = RequestIdVariables & {
  workspace: Workspace;
};
