const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');

/**
 * Metro configuration for Expo
 * https://docs.expo.dev/guides/customizing-metro/
 *
 * @type {import('expo/metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

// Exclude problematic directories to avoid "too many open files" error
config.resolver.blockList = exclusionList([
  // Exclude iOS Pods directory
  /ios\/Pods\/.*/,
  /ios\/build\/.*/,
  // Exclude nested node_modules
  /node_modules\/.*\/node_modules\/.*/,
]);

// Don't watch these directories
config.watchFolders = [];

module.exports = config;


