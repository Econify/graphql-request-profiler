import fs from 'fs';
import path from 'path';

export async function helpText() {
  const pkg = await fs.promises.readFile(
    path.join(__dirname, '../package.json'),
    'utf8'
  );
  const version = JSON.parse(pkg).version;
  return `graphql-request-profiler: Visualize your GraphQL resolver execution time - Version ${version}

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
  --help (boolean)                displays this help text\n`;
}
