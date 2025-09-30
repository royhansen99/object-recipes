import dts from "vite-plugin-dts";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ( 
  process.env.TEST_ENV ? {
      base: "./",
  } :
  command === 'build' ? {
      base: "./",
      plugins: [dts({ rollupTypes: true })],
      build: {
        sourcemap: false,
        lib: {
          entry: path.resolve(__dirname, "src/index.ts"),
          name: "objectRecipes",
          formats: ["es", "cjs", "iife"],
          fileName: (format) => `index.${format}.js`,
        },
      },
  } :
  command === 'serve' ? {
    base: "./",
    publicDir: false,
    plugins: [react()],
    root: "src/example",
  } :
  {}
));
