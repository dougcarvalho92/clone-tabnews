import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier/flat";
import nextPlugin from "@next/eslint-plugin-next";

const nextCoreWebVitalsConfig = nextPlugin.configs?.["core-web-vitals"] ?? {};

const eslintConfig = defineConfig([
  {
    ...nextCoreWebVitalsConfig,
    plugins: {
      ...(nextCoreWebVitalsConfig.plugins ?? {}),
      "@next/next": nextPlugin,
    },
  },
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
