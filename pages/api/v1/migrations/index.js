import migrationRunner from "node-pg-migrate";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });
  }

  let dbClient;

  try {
    const migrationsDirectory = join(process.cwd(), "infra", "migrations");

    console.log("CWD:", process.cwd());
    console.log("MIGRATIONS DIR:", migrationsDirectory);
    console.log("MIGRATIONS EXISTS:", existsSync(migrationsDirectory));

    if (existsSync(migrationsDirectory)) {
      console.log("MIGRATIONS FILES:", readdirSync(migrationsDirectory));
    }

    dbClient = await database.getNewClient();

    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: migrationsDirectory,
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);
      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }

      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
