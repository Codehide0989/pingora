import { mock } from "bun:test";

mock.module("@pingora/upstash", () => ({
  Redis: {
    fromEnv() {
      return {
        get: () => Promise.resolve(undefined),
        set: () => Promise.resolve([]),
      };
    },
  },
}));

mock.module("@pingora/tinybird", () => ({
  OSTinybird: class {
    get legacy_httpStatus45d() {
      return () => Promise.resolve({ data: [] });
    }
    get legacy_tcpStatus45d() {
      return () => Promise.resolve({ data: [] });
    }
  },
}));
