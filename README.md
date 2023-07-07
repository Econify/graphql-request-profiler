# graphql-request-profiler

![Status Checks](https://github.com/Econify/graphql-request-profiler/actions/workflows/checks.yml/badge.svg)

Easy to use GraphQL performance analysis utility for profiling resolver execution time. Observe resolver execution time in your API with a visualization tool.

## Example

```sh
graphql-request-profiler -s examples/operation.graphql -e http://localhost:4000/graphql
```

![Sample Visualizer](https://github.com/Econify/graphql-request-profiler/raw/main/sample.png)

## Installation

For CLI usage with API that has the plugin installed:

```sh
npm i -g @econify/graphql-request-profiler
```

Within a project:

```sh
npm install --save @econify/graphql-request-profiler
```

```sh
yarn add @econify/graphql-request-profiler
```

### CLI Usage

```
$ graphql-request-profiler --help
graphql-request-profiler: Visualize your GraphQL resolver execution time - Version 0.2.0

Usage:

  graphql-request-profiler --data <fileName>
  graphql-request-profiler --schema operation.graphql --endpoint=localhost:4000/graphql
  graphql-request-profiler --help

Arguments:

  --schema, -s (file path)        requesting schema file location
  --output, -o (file path)        output request data to file location
  --endpoint, -e (string)         the endpoint of the GraphQL server to request
  --variables, -v (file path)     variables to pass to the GraphQL server
  --operationName, -n (string)    optional, name of the operation to use in the schema
  --headerName, -h (string)       optional, the name of the header to activate

  --data, -d (string)             display an existing trace file
  --help (boolean)                displays this help text

```

### graphql-http

```js
import { createHandler } from 'graphql-http/lib/use/http';
import { createHttpHandlerProfilerPlugin } from '@econify/graphql-request-profiler';

const server = http.createServer((req, res) => {
  if (req.url?.startsWith('/graphql')) {
    createHandler(
      createHttpHandlerProfilerPlugin(req, {
        schema: buildSchema(),
      })
    )(req, res);
  } else {
    res.writeHead(404).end();
  }
});

server.listen(4000);
console.log('Listening to port 4000');
```

See [full running example here](https://github.com/Econify/graphql-request-profiler/blob/main/examples/graphql-http/http.ts)
See [example of graphql-http with express](https://github.com/Econify/graphql-request-profiler/blob/main/examples/graphql-http/express.ts)

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

#### Deprecated

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
