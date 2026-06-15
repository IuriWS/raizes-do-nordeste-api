import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: 'test/.*\\.e2e-spec\\.ts$',
  testPathIgnorePatterns: ['/node_modules/', '/pacote/'],
  modulePathIgnorePatterns: ['<rootDir>/pacote/'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  testEnvironment: 'node',
  maxWorkers: 1
};

export default config;
