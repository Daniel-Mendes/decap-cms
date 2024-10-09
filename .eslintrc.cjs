const fs = require('node:fs');

const packages = fs
  .readdirSync(`${__dirname}/packages`, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:cypress/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@emotion', 'cypress', '@typescript-eslint'],
  root: true,
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    'import/core-modules': [...packages],
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
    'cypress/globals': true,
  },
  globals: {
    DECAP_CMS_VERSION: false,
    DECAP_CMS_APP_VERSION: false,
    DECAP_CMS_CORE_VERSION: false,
    CMS_ENV: false,
  },
  rules: {
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
      },
    ],
    'import/no-named-as-default': 'off',
    'react/prop-types': 'off',
    'react/no-unknown-property': ['error', { ignore: ['css', 'bold', 'italic', 'delete'] }],
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-unsafe-function-type': 'off',
  }
};
