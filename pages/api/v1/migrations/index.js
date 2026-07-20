import { runner as migrationRunner } from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  const migrationsOptions = {
    dbClient,
    databaseUrl: process.env.DATABASE_URL,
    dir: join(process.cwd(), "infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
    dryRun: true,
  };

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...migrationsOptions,
      dryRun: false,
    });
    await dbClient.end();
    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    return response.status(200).json(migratedMigrations);
  }

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(migrationsOptions);
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  }

  return response.status(405).send("Method Not Allowed");
}
