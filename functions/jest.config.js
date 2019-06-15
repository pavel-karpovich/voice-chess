module.exports = {
  rootDir: './',
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '/tests/.*test\\.ts$',
  testPathIgnorePatterns: ["lib", "node_modules"],
}