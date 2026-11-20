import { describe, expect, it } from "vitest";
import { menuData } from "../../../src/domain/modules/menu.js";

describe("MenuData", () => {
  it("normaliza nombre y ruta interna", () => {
    expect(menuData(" Usuarios ", " /usuarios ")).toEqual({
      name: "Usuarios",
      route: "/usuarios",
    });
  });

  it("rechaza nombre corto y ruta externa", () => {
    expect(() => menuData("a", "/usuarios")).throw();
    expect(() => menuData("Usuarios", "https://example.test")).throw();
  });
});
