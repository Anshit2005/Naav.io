module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/infrastructure/db/migrate.ts',
    '!src/infrastructure/db/seed.ts',
    '!src/infrastructure/server/index.ts',
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testTimeout: 10000,
};

