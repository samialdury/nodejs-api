import { eslint } from '@samialdury/config'

export default [
    ...eslint.config({
        node: true,
        ignores: ['**/__generated__/**', '**/db/**', '**/codegen.*'],
    }),
]
