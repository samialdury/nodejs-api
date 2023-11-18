import { eslint } from '@samialdury/config'

export default [
    ...eslint.config({
        node: true,
        typeScript: true,
    }),
    {
        files: ['src/**/router.ts'],
        rules: {
            'func-style': 'off',
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
        },
    },
    {
        files: ['src/**/controller.ts', 'src/**/plugin.ts'],
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
    {
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
        },
    },
]
