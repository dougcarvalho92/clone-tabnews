const { spawn } = require("child_process");

// Guarda os processos iniciados pelo script.
// Eles serão encerrados quando o usuário pressionar Ctrl + C.
const processes = [];

// Evita que o processo de encerramento seja executado mais de uma vez.
let shuttingDown = false;

/**
 * Executa um comando como processo filho.
 *
 * O stdio "inherit" faz com que o comando utilize o mesmo
 * terminal do npm run dev, permitindo visualizar seus logs.
 *
 * O shell é habilitado no Windows para garantir compatibilidade
 * com a execução dos comandos npm.
 */
function run(command, args) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  processes.push(child);

  return child;
}

/**
 * Para os serviços do Docker Compose.
 *
 * Usamos "stop" em vez de "down" porque queremos apenas parar
 * os containers, mantendo os recursos do ambiente.
 */
function stopServices() {
  return new Promise(resolve => {
    const child = spawn(
      "docker",
      ["compose", "-f", "infra/compose.yaml", "stop"],
      {
        stdio: "inherit",
        shell: process.platform === "win32",
      },
    );

    child.on("close", resolve);
  });
}

/**
 * Encerra todo o ambiente de desenvolvimento.
 *
 * Essa função é chamada quando o usuário pressiona Ctrl + C
 * ou quando o processo recebe SIGTERM.
 */
async function shutdown() {
  // Impede que o encerramento seja executado duas vezes.
  if (shuttingDown) return;

  shuttingDown = true;

  console.log("\nEncerrando aplicação...");

  // Encerra os processos que foram iniciados pelo script,
  // como o Next.js e os comandos auxiliares.
  for (const child of processes) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  console.log("Parando serviços Docker...");

  // Depois que os processos da aplicação foram encerrados,
  // paramos os containers do Docker.
  await stopServices();

  process.exit(0);
}

// Captura Ctrl + C no terminal.
process.on("SIGINT", shutdown);

// Captura sinais de encerramento enviados pelo sistema.
process.on("SIGTERM", shutdown);

/**
 * Inicializa o ambiente de desenvolvimento.
 */
async function main() {
  console.log("Subindo serviços Docker...");

  // 1. Inicia os containers definidos no compose.yaml.
  const services = run("docker", [
    "compose",
    "-f",
    "infra/compose.yaml",
    "up",
    "-d",
  ]);

  services.on("close", async code => {
    // Se o Docker não conseguiu iniciar, encerra o processo.
    if (code !== 0) {
      await shutdown();
      return;
    }

    // 2. Aguarda o PostgreSQL ficar disponível.
    const database = run("npm", ["run", "services:wait:database"]);

    database.on("close", async databaseCode => {
      // Se o banco não estiver disponível, encerra o ambiente.
      if (databaseCode !== 0) {
        await shutdown();
        return;
      }

      // 3. Executa as migrations do banco.
      const migrations = run("npm", ["run", "migrations:up"]);

      migrations.on("close", async migrationCode => {
        // Se as migrations falharem, encerra o ambiente.
        if (migrationCode !== 0) {
          await shutdown();
          return;
        }

        // 4. Finalmente inicia o Next.js.
        run("npm", ["run", "next:dev"]);
      });
    });
  });
}

// Inicia todo o processo.
main();
