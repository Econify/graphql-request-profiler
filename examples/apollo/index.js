const { ApolloServer, gql } = require('apollo-server');
const { buildSchema } = require('./schema');
const { getTraces, createTracableSchema } = require('../../dist');

const options = createTracableSchema({
  schema: buildSchema(),
  formatResponse: (res, { context }) => {
    return {
      ...res,
      extensions: {
        ...getTraces(context),
      },
    }
  }
})

const server = new ApolloServer(options);

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
