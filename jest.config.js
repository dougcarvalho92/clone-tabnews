/*
  arquivo de configuração do jest para o nextjs
*/
const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  setupFiles: ["<rootDir>/jest.setup.js"],
});

module.exports = jestConfig;
