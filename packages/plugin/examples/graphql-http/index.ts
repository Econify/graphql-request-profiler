import http from 'http';
import { createHandler } from 'graphql-http/lib/use/http';
import { buildSchema } from '../schema';
import { createHttpHandlerProfilerPlugin } from '../../src/index';

// Create the GraphQL over HTTP Node request handler

// Create a HTTP server using the listner on `/graphql`
const server = http.createServer((req, res) => {
  const handler = createHandler(createHttpHandlerProfilerPlugin({ schema: buildSchema() }));

  if (req.url?.startsWith('/graphql')) {
    handler(req, res)
  } else {
    res.writeHead(404).end();
  }
});

server.listen(4000);
console.log('Listening to port 4000');