import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { InMemoryModuleRepository } from "../../src/helpers/in-memory.repositories.js";
import { CatalogUseCases } from "../../src/application/modules/catalog.use-cases.js";
import { createCatalogRouter } from "../../src/presentation/http/catalog.routes.js";
import { errorHandler } from "../../src/presentation/http/error-handler.js";

function app() {
  const catalog = new CatalogUseCases(new InMemoryModuleRepository(), {
    findAll: async () => [],
    create: async (moduleId, name, route) => ({
      id: 1,
      moduleId,
      name,
      route,
    }),
    delete: async () => false,
  });
  const api = express();
  api.use(express.json());
  api.use(
    "/api/administracion",
    createCatalogRouter(catalog, () => (_q, _s, _n) => n()),
  );
  api.use(errorHandler);
  return api;
}

describe("Administracion HTTP", () => {
  it("Crea un modulo segun DTO de angular", async () => {
    const api = app();
    const body = { nombre: "Administracion", icono: "", descripcion: "" };
    const result = await request(api)
      .post("/api/administracion/modulos")
      .send(body);
    expect(result.status).toBe(201);
    expect(result.body).toMatchObject({ ...body, id: 1, menus: [] });
    expect(
      (await request(api).get("/api/administracion/modulos")).body,
    ).toHaveLength(1);
    expect(
      (await request(api).post("/api/administracion/modulos").send(body))
        .status,
    ).toBe(409);
    expect(
      (await request(api).post("/api/administracion/modulos").send({})).status,
    ).toBe(400);
  });
});
