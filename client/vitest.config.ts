// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

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
    },
  },
});
