const { buildSchema } = require('./schema');

const { getTraces, createTraceableSchema } = require('../../dist');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const app = express();

app.use(
  '/graphql',
  graphqlHTTP(() =>
    createTraceableSchema({
      schema: buildSchema(),
      graphiql: true,
      extensions: ({ context }) => ({
        ...getTraces(context),
      }),
    })
  )
);

app.listen(4000, () =>
  console.log('Listening on http://localhost:4000/graphql')
);
