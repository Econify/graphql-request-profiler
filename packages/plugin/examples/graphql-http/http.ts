import http from 'http';
import { createHandler } from 'graphql-http/lib/use/http';
import { buildSchema } from '../schema';
import { createHttpHandlerProfilerPlugin } from '../../src/index';

const server = http.createServer((req, res) => {
  if (req.url?.startsWith('/graphql')) {
    createHandler(
      createHttpHandlerProfilerPlugin(req, {
        schema: buildSchema(),
      })
    )(req, res);
  } else {
    res.writeHead(404).end();
  }
});

server.listen(4000);
console.log('Listening to port 4000');
