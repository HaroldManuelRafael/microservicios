import type { Module } from "./module.js";

export interface ModuleRepository {
  existsByName(name: string): Promise<boolean>;
  findById(id: number): Promise<Module | null>;
  findAll(): Promise<Module[]>;
  save(module: Module): Promise<Module>;
}
