import database from "infra/database";
import orquestrador from "../orquestrador.js";

beforeAll(async () => {
  await orquestrador.waitForAllServices();
  await cleanDatabase();
});

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}
describe("GET /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Running pending migrations", async () => {
      // await cleanDatabase();
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });
  });
});
