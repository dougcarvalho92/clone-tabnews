import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";
import { createRouter } from "next-connect";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler).post(postHandler);
export default router.handler(controller.errorHandlers);

function createMigrationOptionsObject(dbClient, dryRun = true) {
  const migrationsDirectory = join(process.cwd(), "infra", "migrations");

  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: dryRun,
    dir: migrationsDirectory,
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  return defaultMigrationOptions;
}

async function getHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrationOptions = createMigrationOptionsObject(dbClient);

    const pendingMigrations = await migrationRunner(defaultMigrationOptions);

    return response.status(200).json(pendingMigrations);
  } finally {
    await dbClient?.end();
  }
}
async function postHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrationOptions = createMigrationOptionsObject(
      dbClient,
      false,
    );
    const migratedMigrations = await migrationRunner(defaultMigrationOptions);

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  } finally {
    await dbClient?.end();
  }
}
