import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

/** @type {import("eslint").FlatConfig[]} */
export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs
    },
    rules: {
      semi: [2, 'always'],
      'space-before-function-paren': [
        0,
        { anonymous: 'always', named: 'always' }
      ],
      camelcase: 0,
      'no-return-assign': 0,
      quotes: ['error', 'single'],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  },
  // Prettier config to override formatting rules
  prettier
];
