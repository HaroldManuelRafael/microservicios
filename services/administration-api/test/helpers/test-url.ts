export function testUrl(): string {
  const value = process.env.TEST_DATABASE_URL;
  if (!value || new URL(value).pathname !== "/administration_service_test") {
    throw new Error("Usa exclusivamente la base de datos de pruebas");
  }

  return value;
}
