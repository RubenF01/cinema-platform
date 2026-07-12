import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd()
      }
    }
  },
  {
    ignores: ["dist/**", ".next/**", "coverage/**", "node_modules/**", "src/generated/**", "eslint.config.js", "next.config.ts", "tailwind.config.ts", "vitest.config.ts", "postcss.config.mjs", "next-env.d.ts"]
  }
];
