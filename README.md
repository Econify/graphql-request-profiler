# graphql-request-profiler

Easy to use GraphQL performance analysis utility for profiling resolver execution time.

## Example

Observe resolver execution time in your API. To run this example, pull down the repository and run `yarn && yarn dev:express`.

```json
{
  "data": {
    "sodas": [
      { "sugar": 0 },
      { "sugar": 0 },
      { "sugar": 0 },
      { "sugar": 0 },
      { "sugar": 0 }
    ]
  },
  "extensions": {
    "totalTimeMs": 1864,
    "traces": [
      {
        "execTimeMs": 888,
        "execStartTimeMs": 2,
        "execEndTimeMs": 890,
        "location": "sodas",
        "parentType": "Query"
      },
      {
        "execTimeMs": 168,
        "execStartTimeMs": 891,
        "execEndTimeMs": 1059,
        "location": "sodas.4.sugar",
        "parentType": "DietCoke"
      },
      {
        "execTimeMs": 193,
        "execStartTimeMs": 891,
        "execEndTimeMs": 1084,
        "location": "sodas.3.sugar",
        "parentType": "DietCoke"
      },
      {
        "execTimeMs": 425,
        "execStartTimeMs": 891,
        "execEndTimeMs": 1316,
        "location": "sodas.0.sugar",
        "parentType": "DietCoke"
      },
      {
        "execTimeMs": 875,
        "execStartTimeMs": 891,
        "execEndTimeMs": 1766,
        "location": "sodas.1.sugar",
        "parentType": "DietCoke"
      },
      {
        "execTimeMs": 972,
        "execStartTimeMs": 891,
        "execEndTimeMs": 1863,
        "location": "sodas.2.sugar",
        "parentType": "DietCoke"
      }
    ]
  }
}
```

## Usage

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

- Web visualizer
  - Colors to represent how expensive a resolver is
  - Add CLI examples
- Tests
- Investigate use w/ federation
