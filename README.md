# graphql-request-profiler

Easy to use GraphQL performance analysis utility for profiling resolver execution time. Observe resolver execution time in your API with a visualization tool.

## Example

```sh
graphql-request-profiler -s examples/operation.graphql -e http://localhost:4000/graphql
```

![Sample Visualizer](/sample.png)

To try this sample yourself, you can pull down the repository and run

```sh
yarn
yarn build
yarn dev:express &
./visualize.js -s examples/operation.graphql -e http://localhost:4000/graphql
```

## Installation

### express-graphql

```js
import { createProfilerOptions } from 'graphql-request-profiler';

const app = express();

app.use(
  '/graphql',
  graphqlHTTP(
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
import { createProfilerPlugin } from 'graphql-request-profiler';

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

- Tests
- Better error handling
- Web visualizer colors to represent how expensive a resolver is
- Investigate use w/ federation
