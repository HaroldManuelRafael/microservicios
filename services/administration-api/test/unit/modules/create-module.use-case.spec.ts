import { describe, expect, it } from "vitest";
import { CreateModuleUseCase } from "../../../src/application/modules/create-module.use-case.js";
import { InMemoryModuleRepository } from "../../../src/helpers/in-memory.repositories.js";

describe("CreateModuleUseCase", () => {
  it("persistencia y retorno de un nuevo modulo", async () => {
    const repository = new InMemoryModuleRepository();
    const useCase = new CreateModuleUseCase(repository);

    const result = await useCase.execute({
      nombre: "Administracion",
      icono: "fa-user-lock",
      descripcion: "Gestion administrativa",
    });

    expect(result).toMatchObject({
      id: 1,
      nombre: "Administracion",
      activo: true,
    });

    expect(repository.items).toHaveLength(1);
  });

  it("rechaza nombres duplicados", async () => {
    const repository = new InMemoryModuleRepository();
    const useCase = new CreateModuleUseCase(repository);
    await useCase.execute({ nombre: "Administracion" });

    await expect(
      useCase.execute({ nombre: "Administracion" }),
    ).rejects.toMatchObject({ code: "MODULE_EXISTS", statusCode: 409 });
  });
});
