import { ApolloServer } from 'apollo-server';
import { buildSchema } from '../schema';
import { createProfilerPlugin } from '../../index';

const server = new ApolloServer({
  schema: buildSchema(),
  plugins: [createProfilerPlugin()],
});

server.listen().then(({ url }) => {
  console.log(`Listening on ${url}`);
});
