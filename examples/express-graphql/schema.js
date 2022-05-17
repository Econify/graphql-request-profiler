const { readFileSync } = require('fs');
const { join } = require('path');
const { makeExecutableSchema } = require('@graphql-tools/schema');

module.exports = {
  buildSchema: () => {
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
  },
};
