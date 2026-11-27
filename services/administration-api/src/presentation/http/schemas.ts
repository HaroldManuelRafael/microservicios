import { z } from "zod";
export const idSchema = z.coerce.number().int().positive().max(2147483647);
export const modulesSchema = z
  .object({
    nombre: z.string().trim().min(3).max(80),
    icono: z.string().trim().max(40),
    description: z.string().trim().max(200),
  })
  .strict();

export const menuSchema = z
  .object({
    nombre: z.string().trim().min(3).max(80),
    ruta: z
      .string()
      .trim()
      .max(200)
      .regex(/^\/[\w\-/]*$/),
  })
  .strict();
