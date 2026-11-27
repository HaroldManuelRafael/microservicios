import { Router } from "express";
import type { CatalogUseCases } from "../../application/modules/catalog.use-cases.js";
import { idSchema, menuSchema, modulesSchema } from "./schemas.js";
import type { Authorize } from "./authorization.js";

export function createCatalogRouter(c: CatalogUseCases, auth: Authorize) {
  const r = Router();
  r.get("/modulos", auth("/modulos", "LECTURA"), async (_req, res) => {
    res.json(await c.list());
  });

  r.post("/modulos", auth("/modulos", "ESCRITURA"), async (req, res) => {
    res.status(201).json(await c.create(modulesSchema.parse(req.body)));
  });

  r.put("/modulos/:id", auth("/modulos", "MODIFICAR"), async (req, res) => {
    res.json(
      await c.update(
        idSchema.parse(req.params.id),
        modulesSchema.parse(req.body),
      ),
    );
  });

  r.delete("/modulos/:id", auth("/modulos", "ELIMINAR"), async (req, res) => {
    await c.remove(idSchema.parse(req.params.id));
    res.sendStatus(204);
  });

  return r
}
