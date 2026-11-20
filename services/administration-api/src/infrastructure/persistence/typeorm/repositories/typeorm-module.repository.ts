import type { Repository } from "typeorm";
import { Module } from "../../../../domain/modules/module.js";
import { ModuleRepository } from "../../../../domain/modules/module-repository.js";
import { ModuleOrmEntity } from "../entities/module.orm-entity.js";

export class TypeOrmModuleRepository implements ModuleRepository {
  constructor(private readonly repository: Repository<ModuleOrmEntity>) {}

  async existsByName(name: string): Promise<boolean> {
    const count = await this.repository
      .createQueryBuilder("m")
      .where("lower(m.name) = lower(:name)", { name: name.trim() })
      .getCount();

    return count > 0;
  }

  async findById(id: number): Promise<Module | null> {
    const row = await this.repository.findOneBy({ id });
    return row ? Module.rehydrate(row) : null;
  }

  async findAll(): Promise<Module[]> {
    return (await this.repository.find({ order: { id: "ASC" } })).map((row) =>
      Module.rehydrate(row),
    );
  }

  async save(module: Module): Promise<Module> {
    const row = this.repository.create({
      ...(module.id === null ? {} : { id: module.id }),
      name: module.name,
      icon: module.icon,
      description: module.description,
      isActive: module.isActive,
    });

    return Module.rehydrate(await this.repository.save(row));
  }

  async deleteById(id: number): Promise<boolean> {
    return (await this.repository.delete(id)).affected === 1;
  }
}
