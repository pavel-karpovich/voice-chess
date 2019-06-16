module.exports = {
  rootDir: './',
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '/tests/.*test\\.ts$',
  coverageDirectory: './coverage/',
  collectCoverageFrom: ['src/**/*.ts', '!src/locales/*.ts']
}