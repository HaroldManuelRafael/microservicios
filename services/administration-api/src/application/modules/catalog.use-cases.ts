import { Module } from "../../domain/modules/module.js";
import type { ModuleRepository } from "../../domain/modules/module-repository.js";
import { menuData, type Menu } from "../../domain/modules/menu.js";
import type { MenuRepository } from "../../domain/modules/menu-repository.js";
import { AplicationError } from "../shared/application-error.js";
import { CreateModuleUseCase } from "./create-module.use-case.js";
import { moduleView } from "./module-views.js";

export type ModuleInput = {
  nombre: string;
  icono: string;
  description: string;
};

const menuView = (m: Menu) => ({ id: m.id, nombre: m.name, ruta: m.route });

const missing = () =>
  new AplicationError("NOT_FOUND", "Resgistro no existe", 404);

export class CatalogUseCases {
  constructor(
    private readonly modules: ModuleRepository,
    private readonly menus: MenuRepository,
  ) {}

  create(input: ModuleInput) {
    return new CreateModuleUseCase(this.modules).execute(input);
  }

  async list() {
    const [modules, menus] = await Promise.all([
      this.modules.findAll(),
      this.menus.findAll(),
    ]);

    const grouped = new Map<number, ReturnType<typeof menuView>[]>();
    for (const menu of menus) {
      const list = grouped.get(menu.moduleId) ?? [];
      list.push(menuView(menu));
      grouped.set(menu.moduleId, list);
    }

    return modules.map((m) => moduleView(m, grouped.get(m.id!) ?? []));
  }

  async update(id: number, input: ModuleInput) {
    const previous = await this.modules.findById(id);

    if (!previous) throw missing();

    const validated = Module.create({
      name: input.nombre,
      icon: input.icono,
      description: input.description,
    });

    if (
      previous.name.toLowerCase() !== validated.name.toLowerCase() &&
      (await this.modules.existsByName(validated.name))
    ) {
      throw new AplicationError("MODULE_EXIST", "El modulo ya existe", 409);
    }

    const saved = await this.modules.save(
      Module.rehydrate({
        id,
        name: validated.name,
        icon: validated.icon,
        description: validated.description,
        isActive: previous.isActive,
      }),
    );

    const menus = (await this.menus.findAll()).filter((m) => m.moduleId === id);
    return moduleView(saved, menus.map(menuView));
  }
}
