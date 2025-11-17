import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/setup.js",
    globals: true,
    coverage: {
      provider: "v8", // important -> @vitest/coverage-v8
      reporter: ["text", "html", "lcov"], // ce que tu veux
      reportsDirectory: "coverage",
      // éventuellement des seuils minimum :
      lines: 70,
      functions: 70,
      branches: 60,
      statements: 70,
    },
  },
  server: {
    port: 8081,
    proxy: {
      "/api": {
        target: "http://localhost:8080", // port du back
        changeOrigin: true,
      },
    },
  },
});
