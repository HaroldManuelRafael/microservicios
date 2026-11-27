import { env } from "./env.js";
import { createDataSource } from "../infrastructure/persistence/typeorm/data-source.js";
import { createApp } from "./app.js";

const db = createDataSource(env.DATABASE_URL);
try {
  await db.initialize();
  const server = createApp(db).listen(env.PORT, env.HOST, () =>
    console.log(`API escuchando en ${env.HOST}:${env.PORT}`),
  );
  const stop = () =>
    server.close(() => {
      void db.destroy().then(
        () => process.exit(0),
        () => process.exit(1),
      );
    });

  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
} catch (error) {
  console.error(
    "No fue posible iniciar el servidor",
    error instanceof Error ? error.name : "Error",
  );
  if (db.isInitialized) await db.destroy();
  process.exitCode = 1;
}
