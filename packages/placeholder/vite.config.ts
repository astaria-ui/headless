// vite.config.ts
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "index.ts"),
      name: "@astaria/placeholder",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["hybrids"],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
