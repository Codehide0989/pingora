import { createRoute } from "@hono/zod-openapi";

import { and, db, eq } from "@pingora/db";
import { incidentTable } from "@pingora/db/src/schema/incidents";

import { PingoraApiError, openApiErrorResponses } from "@/libs/errors";
import type { incidentsApi } from "./index";
import { IncidentSchema, ParamsSchema } from "./schema";

const getRoute = createRoute({
  method: "get",
  tags: ["incident"],
  summary: "Get an incident",
  path: "/{id}",
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: IncidentSchema,
        },
      },
      description: "Get an incident",
    },
    ...openApiErrorResponses,
  },
});

export function registerGetIncident(app: typeof incidentsApi) {
  return app.openapi(getRoute, async (c) => {
    const workspaceId = c.get("workspace").id;
    const { id } = c.req.valid("param");

    const _incident = await db
      .select()
      .from(incidentTable)
      .where(
        and(
          eq(incidentTable.workspaceId, workspaceId),
          eq(incidentTable.id, Number(id)),
        ),
      )
      .get();

    if (!_incident) {
      throw new PingoraApiError({
        code: "NOT_FOUND",
        message: `Incident ${id} not found`,
      });
    }

    const data = IncidentSchema.parse(_incident);

    return c.json(data, 200);
  });
}
