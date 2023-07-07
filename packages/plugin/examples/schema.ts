import { readFileSync } from 'fs';
import { join } from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';

export const buildSchema = () => {
  return makeExecutableSchema({
    typeDefs: readFileSync(join(__dirname, 'schema.graphql')).toString(),
    resolvers: {
      Query: {
        sodas: async () => {
          await new Promise((res) => setTimeout(res, Math.random() * 1000));
          return [{}, {}, {}, {}, {}];
        },
      },
      DietCoke: {
        sugar: async () => {
          await new Promise((res) => setTimeout(res, Math.random() * 1000));
          return 0;
        },
      },
    },
  });
};
