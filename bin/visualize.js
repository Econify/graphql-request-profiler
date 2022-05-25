#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const options = commandLineArgs([
  { name: 'endpoint', alias: 'e', type: String },
  { name: 'schema', alias: 's', type: String },
  { name: 'operationName', alias: 'o', type: String },
  { name: 'variables', alias: 'v', type: String },
]);
console.log(options);
