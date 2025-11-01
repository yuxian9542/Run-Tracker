module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@store': './src/store',
          '@types': './src/types',
          '@utils': './src/utils',
          '@services': './src/services',
          '@hooks': './src/hooks',
          '@constants': './src/constants',
        },
      },
    ],
  ],
};


