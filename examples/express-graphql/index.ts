import { buildSchema } from '../schema';
import { createProfilerOptions } from '../../index';

import express from 'express';
import { graphqlHTTP } from 'express-graphql';

const app = express();
const schema = buildSchema();

app.use(
  '/graphql',
  graphqlHTTP((req) => {
    const options = {
      schema,
      graphiql: true,
    };

    if (req.headers['x-trace'] === 'true') {
      return createProfilerOptions({
        ...options,
        schema: buildSchema(),
      });
    }

    return options;
  })
);

app.listen(4000, () =>
  console.log('Listening on http://localhost:4000/graphql')
);
