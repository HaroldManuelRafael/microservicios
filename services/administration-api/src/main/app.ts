import express from "express";
import type { DataSource } from "typeorm";
import { ModuleOrmEntity } from "../infrastructure/persistence/typeorm/entities/module.orm-entity.js";
import { TypeOrmModuleRepository } from "../infrastructure/persistence/typeorm/repositories/typeorm-module.repository.js";
import { TypeOrmMenuRepository } from "../infrastructure/persistence/typeorm/repositories/typeorm-menu.respository.js";
import { CatalogUseCases } from "../application/modules/catalog.use-cases.js";
import { createCatalogRouter } from "../presentation/http/catalog.routes.js";
import { labOnly } from "../presentation/http/authorization.js";
import { errorHandler } from "../presentation/http/error-handler.js";

export function createApp(db: DataSource) {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "100kb" }));

  app.get("/health", (_req, res) =>
    res.json({
      status: "ok",
      service: "administration-api",
    }),
  );

  const catalog = new CatalogUseCases(
    new TypeOrmModuleRepository(db.getRepository(ModuleOrmEntity)),
    new TypeOrmMenuRepository(db),
  );
  app.use("/api/administracion", createCatalogRouter(catalog, labOnly));
  app.use(errorHandler);
  return app;
}
