import { expect, test } from "bun:test";

import { app } from "@/index";
import { PageSchema } from "./schema";

test("create a valid page", async () => {
  const res = await app.request("/v1/page", {
    method: "POST",
    headers: {
      "x-pingora-key": "1",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title: "Pingora",
      description: "Pingora website",
      slug: "pingora",
      monitors: [1],
    }),
  });

  const result = PageSchema.safeParse(await res.json());

  expect(res.status).toBe(200);
  expect(result.success).toBe(true);
});

test("create a page with invalid monitor ids should return a 400", async () => {
  const res = await app.request("/v1/page", {
    method: "POST",
    headers: {
      "x-pingora-key": "1",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title: "Pingora",
      description: "Pingora website",
      slug: "another-pingora",
      monitors: [404],
    }),
  });

  expect(res.status).toBe(400);
});

test("create a page with password on free plan should return a 402", async () => {
  const res = await app.request("/v1/page", {
    method: "POST",
    headers: {
      "x-pingora-key": "2",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title: "Pingora",
      description: "Pingora website",
      slug: "password-pingora",
      passwordProtected: true,
    }),
  });

  expect(res.status).toBe(402);
});

test("create a email page with invalid payload should return a 400", async () => {
  const res = await app.request("/v1/page", {
    method: "POST",
    headers: {
      "x-pingora-key": "1",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: "Pingora",
      provider: "email",
      payload: { hello: "world" },
    }),
  });

  expect(res.status).toBe(400);
});

test("no auth key should return 401", async () => {
  const res = await app.request("/v1/page", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });

  expect(res.status).toBe(401);
});
