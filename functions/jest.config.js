module.exports = {
  rootDir: './tests/',
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '/.*test\\.ts$',
  setupFiles: ['<rootDir>/extend/jest.matchers.ts']
}