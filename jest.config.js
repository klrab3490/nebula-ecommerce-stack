import nextJest from "next/jest";

// Provide the path to your Next.js app to load next.config.js and .env
const createJestConfig = nextJest({ dir: "./" })

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    // Support @/ alias (tsconfig.json -> paths)
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
}

module.exports = createJestConfig(customJestConfig)
