export class Module {
  private constructor(
    readonly id: number | null,
    readonly name: string,
    readonly icon: string | null,
    readonly description: string | null,
    readonly isActive: boolean,
  ) {}

  static create(input: {
    name: string;
    icon?: string | null;
    description?: string | null;
  }) {
    const name = input.name.trim();
    if (!name) throw new Error("Este modulo requiere un nombre");
    if (name.length > 120)
      throw new Error("El nombre del modulo es muy largo.");

    return new Module(
      null,
      name,
      input.icon?.trim() || null,
      input.description?.trim() || null,
      true,
    );
  }

  static rehydrate(props: {
    id: number;
    name: string;
    icon: string | null;
    description: string | null;
    isActive: boolean;
  }) {
    return new Module(
      props.id,
      props.name,
      props.icon,
      props.description,
      props.isActive,
    );
  }
}
