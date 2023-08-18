import { eslint } from '@samialdury/config'

export default [
    ...eslint.config({
        node: true,
        ignores: ['**/__generated__/**', '**/db/**', '**/codegen.*'],
    }),
    {
        files: ['src/**/plugins/*.ts', 'src/**/plugin.ts'],
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
]
