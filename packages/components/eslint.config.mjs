import defaultConfig from "@tools/eslint-config";
export default [
  ...defaultConfig,
  {
    ignores: ["**/node_modules/**/*", "**/dist/**/*"],
  },
];
