/** @type {import('jest').Config} */
const config = {

  clearMocks: true,

  collectCoverage: true,

  collectCoverageFrom: [
    "src/modules/**/*.ts"
  ],

  coverageDirectory: "coverage",

  coverageProvider: "v8",

  moduleNameMapper: {
    '^@/test/(.*)': '<rootDir>/test/$1',
    '^@/(.*)': '<rootDir>/src/$1',
  },

  preset: "ts-jest",

  testEnvironment: "node",

  testMatch: ['**/test/**/*.test.ts']
};

module.exports = config;
