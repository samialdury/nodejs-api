import { eslint } from '@samialdury/config'

export default [
    ...eslint.config({
        node: true,
        typeScript: true,
    }),
    {
        ignores: ['**/prepare-ci-env.js', '**/prepare-template.js'],
    },
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
            'perfectionist/sort-objects': 'off',
            'perfectionist/sort-interfaces': 'off',
            'perfectionist/sort-object-types': 'off',
        },
    },
]
