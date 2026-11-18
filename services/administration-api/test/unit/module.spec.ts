
import { describe, expect, it } from "vitest";
import { Module } from "../../src/domain/modules/module.js";

describe("Module", () => {
  describe("create", () => {
    it("debe crear un módulo válido y activo", () => {
      // Arrange
      const input = {
        name: "  Administración  ",
        icon: "  settings  ",
        description: "  Gestión administrativa  ",
      };

      // Act
      const module = Module.create(input);

      // Assert
      expect(module.id).toBeNull();
      expect(module.name).toBe("Administración");
      expect(module.icon).toBe("settings");
      expect(module.description).toBe("Gestión administrativa");
      expect(module.isActive).toBe(true);
    });
  });
});
