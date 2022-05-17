# graphql-request-profiler

Easy to use GraphQL performance analysis utility for profiling resolver execution time.

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

#### Important Note

This extension will modify the schema that is passed to it in the options. Please create a copy of the schema or rebuild it on every request to avoid affecting future requests.

### apollo-server

```js
import { tracePlugin } from 'graphql-request-profiler';

const server = new ApolloServer({
  schema: buildSchema(),
  plugins: [tracePlugin],
});

server.listen().then(({ url }) => {
  console.log(`Listening on ${url}`);
});
```

See [full running example here](./examples/apollo/index.js)

## TODO

- Activate via x-trace header
  - Allow customization of this header name
- Use more simple schema for examples
  - Apollo example doesn't need makeExecutableSchema, just inline it
- Investigate use w/ federation (is this even useful? does apollo's plugin replace the need for this?)
- Typescript examples
- Publishing (gh action?)
- Naming: Trace or profile?
