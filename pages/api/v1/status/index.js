import database from "infra/database";
import { InternalServerError } from "infra/errors";
async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();
    const dbOpenedVersionResult = await database.query("SHOW server_version;");

    const databaseMaxConnectionsResult = await database.query(
      "SHOW max_connections;",
    );
    const databaseMaxConnectionsValues =
      databaseMaxConnectionsResult.rows[0].max_connections;

    const dbName = process.env.POSTGRES_DB;
    const dbOpenedConnectionResult = await database.query({
      text: `SELECT count(*) FROM pg_stat_activity WHERE datname = $1;`,
      values: [dbName],
    });

    const dbOpenedConnectionResultReserved = parseInt(
      dbOpenedConnectionResult.rows[0].count,
    );

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: dbOpenedVersionResult.rows[0].server_version,
          max_connections: parseInt(databaseMaxConnectionsValues),
          opened_connections: dbOpenedConnectionResultReserved,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });

    console.error(publicErrorObject);
    response.status(500).json(publicErrorObject);
  }
}

export default status;
