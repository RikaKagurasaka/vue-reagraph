import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import UnoCSS from "unocss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), dts({ tsconfigPath: "./tsconfig.app.json", outDir: "./dist/types" }), UnoCSS({ mode: "per-module" })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueGraphComponents",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
      cssFileName: "index",
    },
    rollupOptions: {
      external: ["vue", "@vue-reagraph/styles", "@vue-reagraph/composables"],
    },
    emptyOutDir: false,
  },
});
