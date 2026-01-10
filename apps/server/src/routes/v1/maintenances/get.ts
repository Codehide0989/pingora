import { PingoraApiError, openApiErrorResponses } from "@/libs/errors";
import { createRoute } from "@hono/zod-openapi";
import { and, db, eq } from "@pingora/db";
import { maintenance } from "@pingora/db/src/schema/maintenances";
import type { maintenancesApi } from "./index";
import { MaintenanceSchema, ParamsSchema } from "./schema";

const getRoute = createRoute({
  method: "get",
  tags: ["maintenance"],
  summary: "Get a maintenance",
  path: "/{id}",
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: MaintenanceSchema,
        },
      },
      description: "Get a maintenance",
    },
    ...openApiErrorResponses,
  },
});

export function registerGetMaintenance(api: typeof maintenancesApi) {
  return api.openapi(getRoute, async (c) => {
    const workspaceId = c.get("workspace").id;
    const { id } = c.req.valid("param");

    const _maintenance = await db.query.maintenance.findFirst({
      with: {
        maintenancesToMonitors: true,
      },
      where: and(
        eq(maintenance.id, Number(id)),
        eq(maintenance.workspaceId, workspaceId),
      ),
    });

    if (!_maintenance) {
      throw new PingoraApiError({
        code: "NOT_FOUND",
        message: `Maintenance ${id} not found`,
      });
    }

    const data = MaintenanceSchema.parse({
      ..._maintenance,
      monitorIds: _maintenance.maintenancesToMonitors.map((m) => m.monitorId),
    });

    return c.json(data, 200);
  });
}
