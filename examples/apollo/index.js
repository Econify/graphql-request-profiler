const { ApolloServer } = require('apollo-server');
const { buildSchema } = require('./schema');
const { tracePlugin } = require('../../dist');

const server = new ApolloServer({
  schema: buildSchema(),
  plugins: [tracePlugin],
});

server.listen().then(({ url }) => {
  console.log(`Listening on ${url}`);
});
