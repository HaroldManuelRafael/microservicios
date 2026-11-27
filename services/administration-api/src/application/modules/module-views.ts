import type { Module } from "../../domain/modules/module.js";

export type MenuView = { id: number; nombre: string; ruta: string };
export function moduleView(module: Module, menus: MenuView[] = []) {
  return {
    id: module.id!,
    nombre: module.name,
    icono: module.icon ?? "",
    description: module.description ?? "",
    activo: module.isActive,
    menus,
  };
}
