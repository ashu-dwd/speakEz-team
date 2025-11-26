export default {
  testEnvironment: "node",
  moduleFileExtensions: ["js"],
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverageFrom: [
    "Routes/**/*.js",
    "controllers/**/*.js",
    "!**/node_modules/**",
  ],
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],
  testTimeout: 30000,
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
