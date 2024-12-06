import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), dts({ tsconfigPath: "./tsconfig.app.json", outDir: "./dist" })],
  build: {
    lib: {
      formats: ["es", "cjs", "iife"],
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueReagraphComponents",
      fileName: "vue-reagraph-components",
    },
    rollupOptions: {
      external: ["vue", "@vue-reagraph/composables"],
      output: {
        globals: {
          vue: "Vue",
          "@vue-reagraph/composables": "VueReagraphComposables",
        },
      },
    },
    // emptyOutDir: false,
  },
});
