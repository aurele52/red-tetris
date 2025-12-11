module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
  ],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
};
