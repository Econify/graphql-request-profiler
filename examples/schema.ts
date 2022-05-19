import { readFileSync } from 'fs';
import { join } from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';

export const buildSchema = () => {
  return makeExecutableSchema({
    typeDefs: readFileSync(join(__dirname, 'schema.graphql')).toString(),
    resolvers: {
      Query: {
        dietCoke: async () => {
          await new Promise((res) => setTimeout(res, 2000));
          return { sugar: 0 };
        },
      },
      Soda: {
        sugar: () => 0,
      },
    },
  });
};
