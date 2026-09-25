import orquestrador from "../../orquestrador";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orquestrador.waitForAllServices();
  await orquestrador.clearDatabase();
  await orquestrador.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "MesmoCase",
          email: "Mesmo.Case@gmail.com",
          password: "senha123",
        }),
      });
      expect(response.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/MesmoCase",
      );

      const response2Body = await response2.json();

      expect(response2.status).toBe(200);
      expect(response2Body).toEqual({
        id: response2Body.id,
        username: "MesmoCase",
        email: "Mesmo.Case@gmail.com",
        password: response2Body.password,
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });
      expect(uuidVersion(response2Body.id)).toBe(4);
      expect(Date.parse(response2Body.created_at)).not.toBeNaN();
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN();
    });
    test("With case mismatch", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "CaseDiferente",
          email: "Case.Diferente@gmail.com",
          password: "senha123",
        }),
      });
      expect(response.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/casediferente",
      );

      const response2Body = await response2.json();

      expect(response2.status).toBe(200);
      expect(response2Body).toEqual({
        id: response2Body.id,
        username: "CaseDiferente",
        email: "Case.Diferente@gmail.com",
        password: response2Body.password,
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });
      expect(uuidVersion(response2Body.id)).toBe(4);
      expect(Date.parse(response2Body.created_at)).not.toBeNaN();
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN();
    });

    test("With nonexistent username", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/NaoExistente",
      );
      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    });
  });
});
