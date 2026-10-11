import baseConfig from './index.js';

export default [
  ...baseConfig,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
];
