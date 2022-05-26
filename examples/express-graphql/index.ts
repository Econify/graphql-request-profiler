import { buildSchema } from '../schema';
import { createExpressProfilerPlugin } from '../../index';

import express from 'express';
import { graphqlHTTP } from 'express-graphql';

const app = express();
const schema = buildSchema();

app.use(
  '/graphql',
  graphqlHTTP((req) =>
    createExpressProfilerPlugin(req, {
      schema,
      graphiql: true,
    })
  )
);

app.listen(4000, () =>
  console.log('Listening on http://localhost:4000/graphql')
);
