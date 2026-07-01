const path = require('path');

module.exports = {
  projects: [
    {
      displayName: 'services',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/services/**/__tests__/**/*.test.ts'],
      setupFiles: ['./jest.cache.setup.js'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
      transform: {
        '^.+\\.tsx?$': ['babel-jest', { configFile: path.join(__dirname, 'babel.config.js') }],
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    },
    {
      displayName: 'components',
      preset: 'jest-expo',
      setupFiles: ['./jest.setup.js'],
      testMatch: ['<rootDir>/components/**/__tests__/**/*.test.tsx'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
      transformIgnorePatterns: [
        'node_modules/(?!(.*\\.(js|jsx|ts|tsx)$|@?react-native|@react-native|@expo|expo-*|react-native-*|@react-navigation|@supabase|@react-native-async-storage))',
      ],
    },
  ],
};
