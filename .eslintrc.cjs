const fs = require('node:fs');

const packages = fs
  .readdirSync(`${__dirname}/packages`, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:unicorn/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:cypress/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@emotion', 'cypress', 'unicorn', '@typescript-eslint'],
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
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-null': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/no-thenable': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-useless-switch-case': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/import-style': 'off',
    'unicorn/no-await-expression-member': 'off',
    'unicorn/error-message': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-unsafe-function-type': 'off',
  },
};
