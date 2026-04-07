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
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            parser: require('@typescript-eslint/parser'),
            parserOptions: {
                project: ['./tsconfig.lint.json'],
                tsconfigRootDir: __dirname,
                sourceType: 'module',
                ecmaVersion: 2020,
            },
        },
        plugins: {
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
            import: require('eslint-plugin-import'),
            node: require('eslint-plugin-node'),
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
            'node/no-missing-import': 'off',
            'node/no-unsupported-features/es-syntax': 'off',
        },
    },
];
