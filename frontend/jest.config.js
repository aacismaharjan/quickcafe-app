export default {
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts{ts,tsx}', '!src/**/*.d.ts', '!**/vendor/**'],
    coverageDirectory: "coverage",
    preset: "ts-jest",
    testEnvironment: "jsdom",
    transform: {
        ".(ts|tsx)": "ts-jest"
    },
    moduleFileExtensions: ['js', 'ts', 'tsx'],
    coveragePathIgnorePatterns: [
        "/node_modules",
        "/coverage",
        "package.json",
        "package-lock.json",
        "reportWebVitals.ts",
        "setupTests.ts",
        "index.tsx"
    ],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"]
}