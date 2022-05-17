# graphql-request-trace

Easy to use GraphQL performance analysis utility for tracing resolver execution time.

## Usage

### express-graphql

```js
import { getTraces, createTracableSchema } from 'graphql-request-profiler';

const app = express();

app.use(
  '/graphql',
  graphqlHTTP(() =>
    createTracableSchema({
      schema: buildSchema(),
      graphiql: true,
      extensions: ({ context }) => ({
        ...getTraces(context),
      }),
    })
  )
);
```

See [full running example here](./examples/express-graphql/index.js)

### Important Note

This extension will modify the schema that is passed to it in the options. Please create a copy of the schema or rebuild it on every request to avoid affecting future requests.

## TODO

- Investigate use w/ apollo
- Investigate use w/ federation
