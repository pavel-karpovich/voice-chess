module.exports = {
  rootDir: './',
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '/tests/.*test\\.ts$',
  setupFiles: ['<rootDir>/tests/extend/jest.matchers.ts'],
  coverageDirectory: './coverage/',
  collectCoverageFrom: ['src/**/*.ts', '!src/locales/*.ts']
}