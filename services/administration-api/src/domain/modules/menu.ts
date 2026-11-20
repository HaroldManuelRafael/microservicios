export type Menu = {
  id: number;
  moduleId: number;
  name: string;
  route: string;
};

export function menuData(name: string, route: string) {
  name = name.trim();
  route = route.trim();

  if (
    name.length < 3 ||
    name.length > 80 ||
    route.length > 200 ||
    !/^\/[\w\-/]*$/.test(route)
  ) {
    throw new Error("Menú invalido");
  }

  return { name, route };
}
