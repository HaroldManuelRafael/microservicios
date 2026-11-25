import { Module } from "../../src/domain/modules/module.js";
import type { ModuleRepository } from "../../src/domain/modules/module-repository.js";

export class InMemoryModuleRepository implements ModuleRepository {
  readonly items: Module[] = [];
  private nextId = 1;

  async existsByName(name: string): Promise<boolean> {
    return this.items.some((item) => item.name === name);
  }

  async findById(id: number): Promise<Module | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findAll(): Promise<Module[]> {
    return [...this.items];
  }

  async save(module: Module): Promise<Module> {
    const saved = Module.rehydrate({
      id: module.id ?? this.nextId++,
      name: module.name,
      icon: module.icon,
      description: module.description,
      isActive: module.isActive,
    });

    const index = this.items.findIndex((item) => item.id === saved.id);

    if (index >= 0) {
      this.items[index] = saved;
    } else {
      this.items.push(saved);
    }

    return saved;
  }

  async deleteById(id: number): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index < 0) return false;
    this.items.splice(index, 1);
    return true;
  }
}
