// @ts-check

import eslint from '@eslint/js';
// const { eslint } = require('@eslint/eslintrc');
import tseslint from 'typescript-eslint';
// const { tseslint } = require('typescript-eslint');

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
);
/*module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    env: {
      browser: true,
      node: true,
      es6: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
    ],
    plugins: ['@typescript-eslint'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        ignores: ['node_modules', 'migrations']
      },
    ],
  };*/
  