import "dotenv/config";
import { z } from "zod";
const schema = z.object({
  PORT: z.coerce.number().int().positive().default(3010),
  HOST: z.literal("127.0.0.1").default("127.0.0.1"),
  DATABASE_URL: z.string().url(),
});
export const env = schema.parse(process.env);
