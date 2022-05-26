#!/usr/bin/env node

import commandLineArgs from 'command-line-args';
import fs from 'fs';
import path from 'path';
import { IGraphQLRequestData, IOptionData } from './types';
import { helpText } from './help';
import { getRequestBody, openUrl, requestGraphQL } from './util';

async function makeRequestAndOpenData(options: IOptionData) {
  const response = await requestGraphQL(getRequestBody(options), options);

  if (response.data.extensions.traces) {
    console.error('Error: No traces found, is the plugin installed properly?');
    process.exit(1);
  }

  // TODO: allow custom output file name in options, use tmp if doesn't exist
  const tmpFileName = `tmp-${Math.random().toString().replace('.', '')}.json`;
  fs.writeFileSync(
    tmpFileName,
    JSON.stringify(response.data.extensions.traces)
  );

  openData({ data: tmpFileName } as IOptionData);
}

function printHelp() {
  console.log(helpText());
}

function openData(options: IOptionData) {
  const pathToWrite = path.join(__dirname, '..', 'viz/data.js');

  const dataContents = fs.readFileSync(options.data).toString();
  fs.writeFileSync(
    pathToWrite,
    `/* eslint-disable no-undef */\nwindow.data = ${dataContents}`
  );

  openUrl(path.join(__dirname, '..', 'viz/index.html'));
}

const options = commandLineArgs([
  { name: 'endpoint', alias: 'e', type: String },
  { name: 'schema', alias: 's', type: String },
  { name: 'operationName', alias: 'o', type: String },
  { name: 'variables', alias: 'v', type: String },
  { name: 'data', alias: 'd', type: String },
  { name: 'help', type: Boolean },
]) as IOptionData;

(async () => {
  if (options.data) {
    openData(options);
    process.exit(0);
  }

  if (options.schema && options.endpoint) {
    await makeRequestAndOpenData(options);
    process.exit(0);
  }

  printHelp();
  process.exit(0);
})();
