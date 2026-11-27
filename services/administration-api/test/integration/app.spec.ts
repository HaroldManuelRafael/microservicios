import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createDataSource } from "../../src/infrastructure/persistence/typeorm/data-source.js";
import { testUrl } from "../helpers/test-url.js";

const db = createDataSource(testUrl());

describe("Composition root Administration", () => {
  beforeAll(async () => {
    await db.initialize();
    await db.runMigrations();
  });

  afterAll(async () => {
    if (db.isInitialized) await db.destroy();
  });

  it("Conecta la aplicacion real y su health", async () => {
    process.env.DATABASE_URL = testUrl();
    const { createApp } = await import("../../src/main/app.js");
    const response = await request(createApp(db)).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      service: "administration-api",
    });
  });
});
