import { eslint } from '@samialdury/config'

export default [
    ...eslint.config({
        node: true,
        ignores: ['**/__generated__/**', '**/db/**', '**/codegen.*'],
    }),
    {
        files: ['src/**/modules/**/controller.ts'],
        rules: {
            'func-style': 'off',
        },
    },
]
