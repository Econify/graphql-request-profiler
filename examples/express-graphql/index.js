const { buildSchema } = require('./schema');

const { createProfilerOptions } = require('../../dist');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const app = express();
const schema = buildSchema();

app.use(
  '/graphql',
  graphqlHTTP((req) => {
    const options = {
      schema: schema,
      graphiql: true,
    }

    if (req.headers['x-profiler-request'] === 'true') {
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
