import { runner as migrationRunner } from "node-pg-migrate";
import { join } from "node:path";
export default async function migrations(request, response) {
  const migrationsOptions = {
    databaseUrl: process.env.DATABASE_URL,
    dir: join("infra", "migrations"),
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
    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    return response.status(200).json(migratedMigrations);
  }

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(migrationsOptions);
    return response.status(200).json(pendingMigrations);
  }

  return response.status(405).send("Method Not Allowed");
}
