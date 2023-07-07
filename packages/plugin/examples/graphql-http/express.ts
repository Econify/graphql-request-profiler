import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { buildSchema } from '../schema';
import { createHttpHandlerProfilerPlugin } from '../../src/index';

const app = express();
app.all('/graphql', (req, res) =>
  createHandler(
    createHttpHandlerProfilerPlugin(req, {
      schema: buildSchema(),
    })
  )
);

app.listen({ port: 4000 });
console.log('Listening to port 4000');
