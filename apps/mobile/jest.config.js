/** @type {import('jest').Config} */
const transformIgnorePatterns = [
  'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|standard-navigation|@standard-navigation/.*|@sentry/react-native|native-base|react-native-svg|intl-messageformat|@formatjs/.*))',
];

module.exports = {
  maxWorkers: 1,
  projects: [
    {
      displayName: 'unit',
      preset: 'jest-expo',
      setupFilesAfterEnv: ['<rootDir>/src/testing/jest.setup.ts'],
      testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/testing/mobile.foundation.test.tsx'],
      moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
      transformIgnorePatterns,
    },
    {
      displayName: 'router',
      preset: 'jest-expo',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.router.ts'],
      testMatch: [
        '<rootDir>/src/testing/router.integration.test.tsx',
        '<rootDir>/src/testing/router.integration.welcome-signin.test.tsx',
        '<rootDir>/src/testing/router.integration.welcome-signup.test.tsx',
      ],
      moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
      transformIgnorePatterns,
    },
  ],
};
