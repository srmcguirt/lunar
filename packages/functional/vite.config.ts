/// <reference types="vitest" />

import { URL, fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    AutoImport({
      dts: "source/auto-import.d.ts",
      eslintrc: {
        enabled: true,
      },
      imports: ["vitest"],
    }),
    Dts({
      outputDir: ["dist", "types"],
      noEmitOnError: true,
      include: ["source/*.ts", "source/**/*.ts"],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./source", import.meta.url)),
      "#": fileURLToPath(new URL("./types", import.meta.url)),
      "~": fileURLToPath(new URL("./test", import.meta.url)),
    },
  },
  build: {
    commonjsOptions: {
      esmExternals: true,
    },
    lib: {
      entry: resolve(__dirname, "source/functional.ts"),
      name: "LunarFunctional",
      formats: ["es", "cjs"],
      fileName: (format): string => `functional.${format}.js`,
    },
  },
  test: {
    globals: true,
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "c8",
      include: ["source/**/*.{js,ts}"],
    },
  },
});
