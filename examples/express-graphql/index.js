const { addResolverTraceExtension } = require('../../dist');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { readFileSync } = require('fs');
const { join } = require('path');

const app = express();

const buildSchema = () => {
  return makeExecutableSchema({
    typeDefs: readFileSync(join(__dirname, 'schema.graphql')).toString(),
    resolvers: {
      Query: {
        dietCoke: async () => {
          await new Promise(res => setTimeout(res, 2000));
          return { sugar: 0 };
        }
      },
      Soda: {
        sugar: () => 0,
      }
    }
  });
}

app.use(
  '/graphql',
  graphqlHTTP(() => {
    const options = {
      schema: buildSchema(),
      graphiql: true,
    };

    return addResolverTraceExtension(options);
  }),
);

app.listen(4000);