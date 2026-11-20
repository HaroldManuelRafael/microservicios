import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { DataSource } from "typeorm";
import { Module } from "../../src/domain/modules/module.js";
import { ModuleOrmEntity } from "../../src/infrastructure/persistence/typeorm/entities/module.orm-entity.js";
import { TypeOrmModuleRepository } from "../../src/infrastructure/persistence/typeorm/repositories/typeorm-module.repository.js";
import { CreateModules1795141201889 } from "../../src/infrastructure/persistence/typeorm/migrations/1795141201889-CreateModules.js";

const url =
  process.env.TEST_DATABASE_URL ??
  "postgresql://administration_service:administration_test123@host.docker.internal:5437/administration_service_test";

const dataSource = new DataSource({
  type: "postgres",
  url,
  entities: [ModuleOrmEntity],
  migrations: [CreateModules1795141201889],
  dropSchema: true,
  synchronize: false,
});

describe("TypeOrmModuleRepository", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    await dataSource.runMigrations();
  });

  beforeEach(async () => {
    await dataSource.query(
      "TRUNCATE TABLE adm_modules RESTART IDENTITY CASCADE",
    );
  });

  afterAll(async () => {
    if (dataSource.isInitialized) await dataSource.destroy();
  });

  it("persistir y recuperar el domain de modulo usando PostgreSQL", async () => {
    const repository = new TypeOrmModuleRepository(
      dataSource.getRepository(ModuleOrmEntity),
    );
    const saved = await repository.save(
      Module.create({ name: "Administracion" }),
    );
    const found = await repository.findById(saved.id!);

    expect(found?.name).toBe("Administracion");
    expect(await repository.existsByName("administracion")).toBe(true);
  });
});
