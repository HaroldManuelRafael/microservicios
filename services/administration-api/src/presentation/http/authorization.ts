import { RequestHandler } from "express";
export type Action = "LECTURA" | "ESCRITURA" | "MODIFICAR" | "ELIMINAR";
export type Authorize = (menu: string, action: Action) => RequestHandler;
export const labOnly: Authorize = () => (_req, res, next) => {
  if (process.env.LAB_MODE !== "1") {
    res.status(503).json({ message: "Autorizacion todavia no configurada" });
    return;
  }
  next();
};
