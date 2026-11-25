import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { QueryFailedError } from "typeorm";
import { AplicationError } from "../../application/shared/application-error.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ZodError) {
    res
      .status(400)
      .json({ code: "VALIDATION_ERROR", message: "Datos invalidos" });
  }

  if (error instanceof AplicationError) {
    res
      .status(error.statusCode)
      .json({ code: error.code, message: error.message });
  }

  if (error instanceof QueryFailedError) {
    const code = (error.driverError as { code?: string }).code;
    if (code === "23505") {
      res
        .status(409)
        .json({ code: "DUPLICATE", message: "Registro duplicado" });
      return;
    }

    if (code === "23503" || code === "23514") {
      res
        .status(422)
        .json({ code: "CONSTRAINT", message: "Relacion o dato invalido" });
      return;
    }
  }

  const status = (error as { status?: number } | null)?.status;

  if (status === 400 || status === 413) {
    res.status(status).json({ message: "Solicitud invalida" });
    return;
  }

  console.error(
    "Error interno",
    error instanceof Error ? error.name : "Unknown",
  );

  res.status(500).json({ code: "INTERNAL_ERROR", message: "Error interno" });
};
