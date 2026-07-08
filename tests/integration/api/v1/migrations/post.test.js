import database from "infra/database";

beforeAll(async () => {
  await cleanDatabase();
});

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("POST to /api/v1/migrations should return 201", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Add any required body parameters here
    }),
  });
  expect(response.status).toBe(201);
  const body = await response.json();
  expect(Array.isArray(body)).toBe(true);
});
