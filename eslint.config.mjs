import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";

const scope = (configs, files) => configs.map((c) => ({ ...c, files }));

export default defineConfig([
  globalIgnores(["**/node_modules/**", "**/.next/**", "**/dist/**", "**/next-env.d.ts", "docs/reference/**"]),

  // apps/web: Next.js, React and accessibility rules.
  ...scope([...nextVitals, ...nextTs], ["apps/web/**/*.{ts,tsx,js,mjs}"]),
  { files: ["apps/web/**"], settings: { next: { rootDir: "apps/web/" } } },

  // packages/core: framework-free TypeScript.
  ...scope(tseslint.configs.recommended, ["packages/**/*.ts"]),

  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
]);
