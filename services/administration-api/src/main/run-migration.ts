import { env } from "./env.js";
import { createDataSource } from "../infrastructure/persistence/typeorm/data-source.js";
const db = createDataSource(env.DATABASE_URL);
try {
  await db.initialize();
  await db.runMigrations();
  console.log("Migraciones aplicadas");
} finally {
  if (db.isInitialized) await db.destroy();
}
