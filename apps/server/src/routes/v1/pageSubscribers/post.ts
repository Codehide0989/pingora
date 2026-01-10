import { createRoute } from "@hono/zod-openapi";

import { PingoraApiError, openApiErrorResponses } from "@/libs/errors";
import { trackMiddleware } from "@/libs/middlewares";
import { Events } from "@pingora/analytics";
import { and, eq, isNotNull } from "@pingora/db";
import { db } from "@pingora/db/src/db";
import { page, pageSubscriber } from "@pingora/db/src/schema";
import { SubscribeEmail, sendEmail } from "@pingora/emails";
import type { pageSubscribersApi } from "./index";
import { PageSubscriberSchema, ParamsSchema } from "./schema";

const postRouteSubscriber = createRoute({
  method: "post",
  tags: ["page_subscriber"],
  summary: "Subscribe to a status page",
  path: "/{id}/update",
  middleware: [trackMiddleware(Events.SubscribePage)],
  description: "Add a subscriber to a status page", // TODO: how to define legacy routes
  request: {
    params: ParamsSchema,
    body: {
      description: "The subscriber payload",
      content: {
        "application/json": {
          schema: PageSubscriberSchema.pick({ email: true }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: PageSubscriberSchema,
        },
      },
      description: "The user has been subscribed",
    },
    ...openApiErrorResponses,
  },
});

export function registerPostPageSubscriber(api: typeof pageSubscribersApi) {
  return api.openapi(postRouteSubscriber, async (c) => {
    const workspaceId = c.get("workspace").id;
    const limits = c.get("workspace").limits;
    const input = c.req.valid("json");
    const { id } = c.req.valid("param");

    if (!limits["status-subscribers"]) {
      throw new PingoraApiError({
        code: "PAYMENT_REQUIRED",
        message: "Upgrade for status subscribers",
      });
    }

    const _page = await db
      .select()
      .from(page)
      .where(and(eq(page.id, Number(id)), eq(page.workspaceId, workspaceId)))
      .get();

    if (!_page) {
      throw new PingoraApiError({
        code: "NOT_FOUND",
        message: `Page ${id} not found`,
      });
    }

    const alreadySubscribed = await db
      .select()
      .from(pageSubscriber)
      .where(
        and(
          eq(pageSubscriber.email, input.email),
          eq(pageSubscriber.pageId, Number(id)),
          isNotNull(pageSubscriber.acceptedAt),
        ),
      )
      .get();

    if (alreadySubscribed) {
      throw new PingoraApiError({
        code: "CONFLICT",
        message: `Email ${input.email} already subscribed`,
      });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    const _statusReportSubscriberUpdate = await db
      .insert(pageSubscriber)
      .values({
        pageId: _page.id,
        email: input.email,
        token,
        expiresAt,
      })
      .returning()
      .get();

    const link = `https://${_page.slug}.pingora.dev/verify/${token}`;

    await sendEmail({
      react: SubscribeEmail({
        link,
        page: _page.title,
      }),
      from: "Pingora <notification@notifications.pingora.dev>",
      to: [input.email],
      subject: "Verify your subscription",
    });

    const data = PageSubscriberSchema.parse(_statusReportSubscriberUpdate);

    return c.json(data, 200);
  });
}
