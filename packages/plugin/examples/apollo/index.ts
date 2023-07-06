import { ApolloServer } from 'apollo-server';
import { buildSchema } from '../schema';
import { createApolloProfilerPlugin } from '../../src/index';

const server = new ApolloServer({
  schema: buildSchema(),
  plugins: [createApolloProfilerPlugin()],
});

server.listen().then(({ url }) => {
  console.log(`Listening on ${url}`);
});
