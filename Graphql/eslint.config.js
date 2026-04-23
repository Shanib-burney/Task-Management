const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const importPlugin = require('eslint-plugin-import');

module.exports = [
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/generated/**',
      '**/dist/generated/**',
      '.env',

      '.env.*',
      '**/.prisma/**',
      '**/coverage/**',
      'eslint.config.js',
      'prisma.config.ts',
    ],
  },
  // Base JS rules
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.lint.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaVersion: 2020,
      },
    },

    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.lint.json',
        },
        node: {
          paths: ['src'],
          extensions: ['.js', '.ts', '.json'],
        },
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-console': 'off',
      'import/no-unresolved': 'error',
    },
  },
];
