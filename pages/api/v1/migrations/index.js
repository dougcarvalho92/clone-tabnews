import { runner as migrationRunner } from "node-pg-migrate";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  if (!isMethodAllowed(request.method)) {
    return response.status(405).json({
      error: `Method ${request.method} Not Allowed`,
    });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migrationsOptions = {
      dbClient,
      databaseUrl: process.env.DATABASE_URL,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
      dryRun: true,
    };
    const migrationsDir = join(process.cwd(), "infra", "migrations");

    console.log("CWD:", process.cwd());
    console.log("Migrations dir:", migrationsDir);
    console.log("Exists:", existsSync(migrationsDir));

    if (existsSync(migrationsDir)) {
      console.log("Files:", readdirSync(migrationsDir));
    }
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
  } catch (error) {
    console.log(error);
    throw new Error("Error running migrations");
  } finally {
    await dbClient.end();
  }
}

function isMethodAllowed(method) {
  const allowedMethods = ["GET", "POST"];
  return allowedMethods.includes(method);
}
