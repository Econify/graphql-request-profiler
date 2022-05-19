# graphql-request-profiler

Easy to use GraphQL performance analysis utility for profiling resolver execution time.

## Usage

### express-graphql

```js
import { createProfilerOptions } from 'graphql-request-profiler';

const app = express();

app.use(
  '/graphql',
  graphqlHTTP(() =>
    createProfilerOptions({
      schema: buildSchema(),
      graphiql: true,
    })
  )
);
```

See [full running example here](./examples/express-graphql/index.js)

#### Important Note

This extension will modify the schema that is passed to it in the options. Please create a copy of the schema or rebuild it on every request to avoid affecting future requests, as is done in the full running example.

### apollo-server

```js
import { tracePlugin } from 'graphql-request-profiler';

const server = new ApolloServer({
  schema: buildSchema(),
  plugins: [createProfilerPlugin()],
});

server.listen().then(({ url }) => {
  console.log(`Listening on ${url}`);
});
```

See [full running example here](./examples/apollo/index.js)

## TODO

- Activate via x-trace header
  - Allow customization of this header name
  - Apollo plugin config
  - Express-graphql config
- Fix types
- Use more simple schema for examples
  - Apollo example doesn't need makeExecutableSchema, just inline it
- Investigate use w/ federation (is this even useful? does apollo's plugin replace the need for this?)
- Typescript examples
- Publishing (gh action?)
- Naming: Trace or profile?
- Web visualizer
