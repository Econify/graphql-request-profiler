import { version } from './package.json';

export function helpText() {
  return `graphql-request-profiler: Visualize your GraphQL resolver execution time - Version ${version}

Usage:

  graphql-request-profiler --data <fileName>
  graphql-request-profiler --schema operation.graphql --endpoint=localhost:4000/graphql
  graphql-request-profiler --help

Arguments:

  data (string)             display an existing trace file
  schema (file path)        requesting schema file location
  operationName (string)    optional, name of the operation to use in the schema
  endpoint (string)         the endpoint of the GraphQL server to request
  help (boolean)            displays this help text\n`;
}
