import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DataSource } from "typeorm";

const url =
  process.env.TEST_DATABASE_URL ??
  "postgresql://administration_service:administration_test123@host.docker.internal:5437/administration_service_test";

const dataSource = new DataSource({
  type: "postgres",
  url,
  entities: [],
  migrations: [],
  synchronize: false,
});

describe("Configuracion de el administrador TypeOrm", () => {
  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) await dataSource.destroy();
  });

  it("Conectandonos a la base de datos de test", async () => {
    const rows = await dataSource.query(
      "SELECT current_database() AS database_name",
    );
    expect(rows[0]?.database_name).toBe("administration_service_test");
  });
});
