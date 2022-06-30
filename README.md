# graphql-request-profiler

![Status Checks](https://github.com/Econify/graphql-request-profiler/actions/workflows/checks.yml/badge.svg)

Easy to use GraphQL performance analysis utility for profiling resolver execution time. Observe resolver execution time in your API with a visualization tool.

## Example

```sh
graphql-request-profiler -s examples/operation.graphql -e http://localhost:4000/graphql
```

![Sample Visualizer](https://github.com/Econify/graphql-request-profiler/raw/main/sample.png)

## Installation

```sh
npm install --save @econify/graphql-request-profiler
```

```sh
yarn add @econify/graphql-request-profiler
```

### express-graphql

```js
import { createExpressProfilerPlugin } from '@econify/graphql-request-profiler';

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

See [full running example here](https://github.com/Econify/graphql-request-profiler/blob/main/examples/express-graphql/index.ts)

### apollo-server

```js
import { createApolloProfilerPlugin } from '@econify/graphql-request-profiler';

const server = new ApolloServer({
  schema: buildSchema(),
  plugins: [createApolloProfilerPlugin()],
});

server.listen().then(({ url }) => {
  console.log(`Listening on ${url}`);
});
```

See [full running example here](https://github.com/Econify/graphql-request-profiler/blob/main/examples/apollo/index.ts)

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

## Like this package?

Check out Econify's other GraphQL package, [graphql-rest-router](https://www.github.com/Econify/graphql-rest-router), that allows routing to and caching an internal GraphQL API as a self-documenting REST API without exposing the schema!
