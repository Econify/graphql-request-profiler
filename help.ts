import { version } from './package.json';

export function helpText() {
  return `graphql-request-profiler: Visualize your GraphQL resolver execution time - Version ${version}

Usage:

  graphql-request-profiler --data <fileName>
  graphql-request-profiler --schema operation.graphql --endpoint=localhost:4000/graphql
  graphql-request-profiler --help

Arguments:

  --data, -d (string)             display an existing trace file
  --schema, -s (file path)        requesting schema file location
  --output, -o (file path)        output request data to file location
  --operationName, -n (string)    optional, name of the operation to use in the schema
  --endpoint, -e (string)         the endpoint of the GraphQL server to request
  --help (boolean)                displays this help text\n`;
}
