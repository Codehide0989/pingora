import { createRoute } from "@hono/zod-openapi";

import { PingoraApiError, openApiErrorResponses } from "@/libs/errors";
import { and, eq } from "@pingora/db";
import { db } from "@pingora/db/src/db";
import { page } from "@pingora/db/src/schema";
import type { pagesApi } from "./index";
import { PageSchema, ParamsSchema, transformPageData } from "./schema";

const getRoute = createRoute({
  method: "get",
  tags: ["page"],
  summary: "Get a status page",
  path: "/{id}",
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: PageSchema,
        },
      },
      description: "Get an Status page",
    },
    ...openApiErrorResponses,
  },
});

export function registerGetPage(api: typeof pagesApi) {
  return api.openapi(getRoute, async (c) => {
    const workspaceId = c.get("workspace").id;
    const { id } = c.req.valid("param");

    const _page = await db
      .select()
      .from(page)
      .where(and(eq(page.workspaceId, workspaceId), eq(page.id, Number(id))))
      .get();

    if (!_page) {
      throw new PingoraApiError({
        code: "NOT_FOUND",
        message: `Page ${id} not found`,
      });
    }

    const data = transformPageData(PageSchema.parse(_page));

    return c.json(data, 200);
  });
}
