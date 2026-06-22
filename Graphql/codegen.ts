import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'src/modules/**/*.graphql',
  generates: {
    'src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../context#GraphQLContext',
        useIndexSignature: true,
        mappers: {
          User: '../mappers#UserMapper',
          Project: '../mappers#ProjectMapper',
          Task: '../mappers#TaskMapper',
          Team: '../mappers#TeamMapper',
        },
      },
    },
  },
};

export default config;
