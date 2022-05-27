# graphql-request-profiler

![example workflow](https://github.com/Econify/graphql-request-profiler/actions/workflows/check-package.yml/badge.svg)

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
./cli.js -s examples/operation.graphql -e http://localhost:4000/graphql
```

## Installation

### express-graphql

```js
import { createExpressProfilerPlugin } from 'graphql-request-profiler';

const app = express();

app.use(
  '/graphql',
  graphqlHTTP((req) =>
    createExpressProfilerPlugin(req, {
      schema,
      graphiql: true,
    })
  )
);
```

See [full running example here](./examples/express-graphql/index.ts)

### apollo-server

```js
import { createApolloProfilerPlugin } from 'graphql-request-profiler';

const server = new ApolloServer({
  schema: buildSchema(),
  plugins: [createApolloProfilerPlugin()],
});

server.listen().then(({ url }) => {
  console.log(`Listening on ${url}`);
});
```

See [full running example here](./examples/apollo/index.ts)

### Custom Activation Header

If the server requires a different HTTP header to activate the plugin besides `x-trace`, a custom header name can be specified in the configuration to the plugin.

```js
createApolloProfilerPlugin({ headerName: 'x-custom-header' });
createExpressProfilerPlugin(req, options, { headerName: 'x-custom-header' });
```

A custom plugin activation HTTP header may be specified when using the CLI tool.

```sh
graphql-request-profiler --headerName x-custom-header [...]
```
