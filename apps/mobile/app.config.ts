import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'VYMOD',
  slug: 'vymod',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'vymod',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.vymod.app',
  },
  android: {
    package: 'com.vymod.app',
    adaptiveIcon: {
      backgroundColor: '#0B0D10',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    output: 'server',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-localization',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#0B0D10',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
