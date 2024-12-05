import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import UnoCSS from "unocss/vite";
import { presetUno, transformerDirectives } from "unocss";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), dts({ tsconfigPath: "./tsconfig.app.json", outDir: "./dist" }), UnoCSS({ mode: "per-module", presets: [presetUno({})], transformers: [transformerDirectives()] })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "vue-reagraph-components",
      fileName: "vue-reagraph-components",
    },
    rollupOptions: {
      external: ["vue", "@vue-reagraph/composables"],
    },
    // emptyOutDir: false,
  },
});
