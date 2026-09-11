import retry from "async-retry";
import database from "infra/database";

async function waitForAllServices() {
  await waitForWebServer();
  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });
    async function fetchStatusPage() {
      const respose = await fetch("http://localhost:3000/api/v1/status");
      if (respose.status !== 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}
const orquestrador = {
  waitForAllServices,
  clearDatabase,
};

export default orquestrador;
