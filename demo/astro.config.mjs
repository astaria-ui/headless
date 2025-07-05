// @ts-check
import { defineConfig } from "astro/config";
import { visualizer } from "rollup-plugin-visualizer";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      visualizer({
        emitFile: true,
        filename: "stats.html",
        gzipSize: true,
      }),
    ],
  },
});
