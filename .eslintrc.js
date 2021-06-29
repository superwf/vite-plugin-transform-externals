module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'prettier'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:import/typescript'],

  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        usePrettierrc: true,
      },
    ],
    'import/order': ['error', { 'newlines-between': 'never' }],
    'import/first': 0,
    'import/no-extraneous-dependencies': 0,
    '@typescript-eslint/consistent-type-imports': 'error',

    '@typescript-eslint/no-extra-semi': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'import/prefer-default-export': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],

    // let prettier handle indent
    '@typescript-eslint/indent': 0,
    // '@typescript-eslint/interface-name-prefix': [1, 'always'],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],

    // skip check var starts with "_"
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true, varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/explicit-member-accessibility': ['error', { overrides: { constructors: 'no-public' } }],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
}
