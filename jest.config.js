/* eslint-disable @typescript-eslint/no-require-imports */
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
  coveragePathIgnorePatterns: [
    'node_modules',
    'test-config',
    'interfaces',
    'jestGlobalMocks.ts',
    '\\.module\\.ts',
    '\\.decorator\\.ts',
    '\\.interceptor\\.ts',
    'in-memory\\.repository\\.ts',
    '<rootDir>/src/app/main.ts',
    '\\.mock\\.ts',
    'main.ts',
  ],
  collectCoverageFrom: ['**/*.(t|j)s'],
  testEnvironment: 'node',
};

module.exports = config;
