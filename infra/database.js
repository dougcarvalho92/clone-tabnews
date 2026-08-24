import { Client } from "pg";

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSlValues(),
  });

  try {
    await client.connect();
    return client;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

export default {
  query,
  getNewClient,
};

function getSSlValues() {
  if (process.env.POSTGRES_CA) {
    //CERTIFICADO DO DIGITAL OCEAN
    return {
      ca: process.env.POSTGRES_CA,
    };
  }
  return process.env.NODE_ENV === "production" ? true : false;
}
