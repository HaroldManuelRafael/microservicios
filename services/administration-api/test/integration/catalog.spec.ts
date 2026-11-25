import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createDataSource } from "../../src/infrastructure/persistence/typeorm/data-source.js";
import { ModuleOrmEntity } from "../../src/infrastructure/persistence/typeorm/entities/module.orm-entity.js";
import { TypeOrmModuleRepository } from "../../src/infrastructure/persistence/typeorm/repositories/typeorm-module.repository.js";
import { TypeOrmMenuRepository } from "../../src/infrastructure/persistence/typeorm/repositories/typeorm-menu.respository.js";
import { CatalogUseCases } from "../../src/application/modules/catalog.use-cases.js";
import { testUrl } from "../helpers/test-url.js";

const db = createDataSource(testUrl());
describe("CatlogUseCases", () => {
  beforeAll(async () => {
    await db.initialize();
    await db.runMigrations();
  });
  beforeEach(async () => {
    await db.query("TRUNCATE adm_modules RESTART IDENTITY CASCADE");
  });
  afterAll(async () => {
    if (db.isInitialized) await db.destroy();
  });

  it("gestiona el catalogo y conserva la integridad", async () => {
    const catalogs = new CatalogUseCases(
      new TypeOrmModuleRepository(db.getRepository(ModuleOrmEntity)),
      new TypeOrmMenuRepository(db),
    );

    const input = { nombre: "Administracion", icono: "", description: "" };
    const mod = await catalogs.create(input);
    const menu = await catalogs.addMenu(mod.id, {
      nombre: "Usuarios",
      ruta: "/usuarios",
    });

    expect((await catalogs.list())[0]?.menus).toEqual([menu]);
    expect(
      (await catalogs.update(mod.id, { ...input, nombre: "Operacion" })).id,
    ).toBe(mod.id);

    await expect(catalogs.removeMenu(mod.id, menu.id)).rejects.toMatchObject({
      statusCode: 404,
    });
    await catalogs.remove(mod.id);
    expect(await catalogs.list()).toEqual([]);
    expect(await new TypeOrmMenuRepository(db).findAll()).toEqual([]);
  });
});
