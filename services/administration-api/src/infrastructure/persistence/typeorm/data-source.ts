import "reflect-metadata";
import { DataSource } from "typeorm";
import { ModuleOrmEntity } from "./entities/module.orm-entity.js";
import { CreateModules1795141201889 } from "./migrations/1795141201889-CreateModules.js";

export function createDataSource(url: string) {
  return new DataSource({
    type: "postgres",
    url,
    entities: [ModuleOrmEntity],
    migrations: [CreateModules1795141201889],
    synchronize: false,
  });
}
