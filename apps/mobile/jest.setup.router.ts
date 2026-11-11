Object.defineProperty(global, '__DEV__', { value: false, configurable: true });

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageTag: 'de-DE' }],
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- jest mock bootstrap
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(() => 'dark'),
}));
