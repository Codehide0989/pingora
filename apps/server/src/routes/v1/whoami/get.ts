import { PingoraApiError, openApiErrorResponses } from "@/libs/errors";
import { createRoute } from "@hono/zod-openapi";
import { eq } from "@pingora/db";
import { db } from "@pingora/db/src/db";
import { workspace } from "@pingora/db/src/schema/workspaces";
import type { whoamiApi } from ".";
import { WorkspaceSchema } from "./schema";

const getRoute = createRoute({
  method: "get",
  tags: ["whoami"],
  path: "/",
  summary: "Get your informations",
  description: "Get the current workspace information attached to the API key.",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: WorkspaceSchema,
        },
      },
      description: "The current workspace information with the limits",
    },
    ...openApiErrorResponses,
  },
});

export function registerGetWhoami(api: typeof whoamiApi) {
  return api.openapi(getRoute, async (c) => {
    const workspaceId = c.get("workspace").id;

    const _workspace = await db
      .select()
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .get();

    if (!_workspace) {
      throw new PingoraApiError({
        code: "NOT_FOUND",
        message: `Workspace ${workspaceId} not found`,
      });
    }

    const data = WorkspaceSchema.parse(_workspace);
    return c.json(data, 200);
  });
}
