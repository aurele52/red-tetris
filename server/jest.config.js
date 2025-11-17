const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}", // ➜ tous les fichiers TypeScript de src
    "!src/**/*.d.ts", // ➜ exclure les déclarations de types
  ],
  transform: {
    ...tsJestTransformCfg,
  },
};

