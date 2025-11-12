const fs = require('fs');
const path = require('path');

const packages = fs
  .readdirSync(path.join(__dirname, 'packages'), { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

module.exports = {
  parser: '@typescript-eslint/parser', // handles both JS and TS
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module', // enables ESM imports
    ecmaFeatures: {
      jsx: true, // for React
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:cypress/recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
    'cypress/globals': true,
  },
  globals: {
    DECAP_CMS_VERSION: false,
    DECAP_CMS_APP_VERSION: false,
    DECAP_CMS_CORE_VERSION: false,
    CMS_ENV: false,
  },
  plugins: ['@emotion', 'cypress', 'unicorn', '@typescript-eslint'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    'import/core-modules': [...packages, 'decap-cms-app/dist/esm'],
  },
  rules: {
    'no-console': 'off',
    'react/prop-types': 'off',
    'import/no-named-as-default': 'off',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index'], ['type']],
      },
    ],
    'no-duplicate-imports': 'error',
    '@emotion/no-vanilla': 'error',
    '@emotion/pkg-renaming': 'error',
    '@emotion/import-from-emotion': 'error',
    '@emotion/styled-import': 'error',
    'require-atomic-updates': 'off',
    'object-shorthand': ['error', 'always'],
    'func-style': ['error', 'declaration'],
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
      },
    ],
    'unicorn/prefer-string-slice': 'error',
    'react/no-unknown-property': ['error', { ignore: ['css', 'bold', 'italic', 'delete'] }],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-duplicate-imports': 'off', // handled by TS
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-duplicate-imports': 'error',
        '@typescript-eslint/no-use-before-define': [
          'error',
          { functions: false, classes: true, variables: true },
        ],
      },
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off', // allow require in JS
      },
    },
  ],
  ignorePatterns: ['scripts/**', 'dist/**', 'node_modules/**'], // ignore scripts to avoid ESM parse issues
};
