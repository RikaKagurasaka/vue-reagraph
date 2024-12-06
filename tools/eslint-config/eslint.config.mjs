import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import pluginUnusedImports from "eslint-plugin-unused-imports";

/** @type {import("eslint").Linter.Config} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  {
    ignores: ["**/dist/**", "**/node_modules/**"],
  },
  {
    plugins: {
      "unused-imports": pluginUnusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
    },
  },
];
