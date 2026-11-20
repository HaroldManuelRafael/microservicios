import { describe, expect, it, vi } from "vitest";
import { CatalogUseCases } from "../../../src/application/modules/catalogo.use-cases.js";
import { InMemoryModuleRepository } from "../../../src/helpers/in-memory.repositories.js";
describe("CatalogUseCase", () => {
  it("agrupa menús y no permite crear un menú huérfano", async () => {
    const modules = new InMemoryModuleRepository();
    const menus = {
      findAll: vi.fn(async () => [
        { id: 1, moduleId: 1, name: "Usuario", route: "/usuarios" },
      ]),
      create: vi.fn(async (moduleId: number, name: string, route: string) => ({
        id: 2,
        moduleId,
        name,
        route,
      })),
      delete: vi.fn(async () => false),
    };

    const use = new CatalogUseCases(modules, menus);

    await use.create({ nombre: "Admin", icono: "", descripcion: "" });
    await expect(
      use.addMenu(99, { nombre: "Menú", ruta: "/menu" }),
    ).rejects.toMatchObject({ statusCode: 404 });
    expect(menus.create).not.toHaveBeenCalled();
    expect((await use.list())[0]?.menus).toEqual([
      { id: 1, nombre: "Usuarios", ruta: "/usuarios" },
    ]);
    await expect(use.removeMenu(1, 99)).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
