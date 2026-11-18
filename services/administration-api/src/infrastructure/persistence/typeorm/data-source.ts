import "reflect-metadata";
import { DataSource } from "typeorm";

export function createDataSource(url: string) {
  return new DataSource({
    type: "postgres",
    url,
    entities: [],
    migrations: [],
    synchronize: false,
  });
}
