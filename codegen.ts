import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    schema: './schema.gql',
    generates: {
        './src/__generated__/resolvers-types.ts': {
            plugins: ['typescript', 'typescript-resolvers'],
            config: {
                useIndexSignature: true,
                useTypeImports: true,
                maybeValue: 'T | null | undefined',
                contextType: '../api/types.js#GraphQLContext',
            },
        },
    },
}

export default config
