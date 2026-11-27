import { env } from "./env.js";
import { createDataSource } from "../infrastructure/persistence/typeorm/data-source.js";

const db = createDataSource(env.DATABASE_URL);

db.setOptions({
  logging: ["schema", "error"],
});

try {
  await db.initialize();

  console.log("Estado de migraciones:");

  const hasPendingMigrations = await db.showMigrations();

  console.log(
    hasPendingMigrations
      ? "Existen migraciones pendientes."
      : "Todas las migraciones están aplicadas.",
  );
} finally {
  if (db.isInitialized) {
    await db.destroy();
  }
}