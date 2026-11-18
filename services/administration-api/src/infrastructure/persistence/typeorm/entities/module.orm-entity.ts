import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "adm_modules" })
export class ModuleOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "name", type: "varchar", length: 120, unique: true })
  name!: string;

  @Column({ name: "icon", type: "varchar", length: 80, nullable: true })
  icon!: string | null;

  @Column({ name: "Description", type: "varchar", length: 255, nullable: true })
  description!: string | null;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;
}
