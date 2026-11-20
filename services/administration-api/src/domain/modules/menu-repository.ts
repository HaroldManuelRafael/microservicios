import type { Menu } from "./menu.js";
export interface MenuRepository {
  findAll(): Promise<Menu[]>;
  create(moduleId: number, name: string, route: string): Promise<Menu>;
  delete(moduleId: number, menuId: number): Promise<boolean>;
}
