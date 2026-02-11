const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/index.{ts,tsx}',
    // '!src/**/actions.ts',
    '!src/**/page.tsx',
    '!src/**/layout.tsx',
  ],
  coverageThreshold: {
    // Domain: pure business logic, must be thoroughly tested
    './src/domain/': {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    // Application: use cases orchestrating business rules
    './src/application/': {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    // Infrastructure: will be swapped (e.g. Supabase), lower threshold OK
    './src/infrastructure/': {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // UI: render tests + key interactions, not pixel-perfect coverage
    './src/app/': {
      branches: 60,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
  ],
}

module.exports = createJestConfig(customJestConfig)