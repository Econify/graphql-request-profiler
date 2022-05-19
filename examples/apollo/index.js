const { ApolloServer } = require('apollo-server');
const { buildSchema } = require('./schema');
const { createProfilerPlugin } = require('../../dist');

const server = new ApolloServer({
  schema: buildSchema(),
  plugins: [createProfilerPlugin()],
});

server.listen().then(({ url }) => {
  console.log(`Listening on ${url}`);
});
