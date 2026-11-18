import { Module } from "../../domain/modules/module.js";
import type { ModuleRepository } from "../../domain/modules/module-repository.js";
import { AplicationError } from "../shared/application-error.js";

export class CreateModuleUseCase {
  constructor(private readonly modules: ModuleRepository) {}

  async execute(input: {
    nombre: string;
    icono?: string | null;
    descripcion?: string | null;
  }) {
    if (await this.modules.existsByName(input.nombre.trim())) {
      throw new AplicationError("MODULE_EXISTS", "El modulo ya existe.", 409);
    }

    const module = Module.create({
      name: input.nombre,
      icon: input.icono ?? null,
      description: input.descripcion ?? null,
    });

    return this.toView(await this.modules.save(module));
  }

  private toView(module: Module) {
    return {
      id: module.id,
      nombre: module.name,
      icono: module.icon,
      descripcion: module.description,
      activo: module.isActive,
    };
  }
}
