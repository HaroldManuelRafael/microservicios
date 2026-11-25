import { DataSource } from "typeorm";
import { Menu } from "../../../../domain/modules/menu.js";
import { MenuRepository } from "../../../../domain/modules/menu-repository.js";

type Row = { id: number; module_id: number; name: string; route: string };
const map = (r: Row): Menu => ({
  id: r.id,
  moduleId: r.module_id,
  name: r.name,
  route: r.route,
});

export class TypeOrmMenuRepository implements MenuRepository {
  constructor(private readonly db: DataSource) {}

  async findAll(): Promise<Menu[]> {
    const rows: Row[] = await this.db.query(
      "SELECT * FROM adm_menus ORDER BY id",
    );
    return rows.map(map);
  }

  async create(moduleId: number, name: string, route: string): Promise<Menu> {
    const rows: Row[] = await this.db.query(
      `INSERT INTO adm_menus (module_id,name,route) VALUES ($1, $2, $3) RETURNING *`,
      [moduleId, name, route],
    );

    return map(rows[0]!);
  }

  async delete(moduleId: number, menuId: number): Promise<boolean> {
    const rows: { id: number }[] = await this.db.query(
      `WITH removed AS (
        DELETE FROM adm_menus WHERE module_id=$1 AND id=$2 RETURNING id
        ) SELECT id FROM removed`,
      [moduleId, menuId],
    );

    return rows.length === 1;
  }
}
