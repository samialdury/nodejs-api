import { eslint } from '@samialdury/config'

export default [
    ...eslint.config({
        node: true,
        typeScript: true,
    }),
    {
        ignores: ['**/__generated__/**', 'codegen.*'],
    },
    {
        files: ['src/**/plugins/*.ts', 'src/**/router.ts'],
        rules: {
            'func-style': 'off',
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
        },
    },
    {
        files: ['src/**/controller.ts'],
        rules: {
            'func-style': 'off',
        },
    },
    {
        files: ['src/**/*.d.ts', 'iac/**/*.ts'],
        rules: {
            'import/no-extraneous-dependencies': 'off',
        },
    },
]
