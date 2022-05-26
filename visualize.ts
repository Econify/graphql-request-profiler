#!/usr/bin/env node

import commandLineArgs from 'command-line-args';
import fs from 'fs';
import path from 'path';
import { IOptionData } from './types';
import { getRequestBody, openUrl, printHelp, requestGraphQL } from './util';

async function makeRequestAndOpenData(options: IOptionData) {
  const response = await requestGraphQL(getRequestBody(options), options);

  if (response.data?.extensions?.traces) {
    console.error('Error: No traces found, is the plugin installed properly?');
    process.exit(1);
  }

  const fileName =
    options.output || `tmp-${Math.random().toString().replace('.', '')}.json`;

  fs.writeFileSync(fileName, JSON.stringify(response.data.extensions.traces));

  openData({ data: fileName } as IOptionData);

  if (!options.output) {
    fs.rmSync(fileName);
  }
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
  { name: 'output', alias: 'o', type: String },
  { name: 'endpoint', alias: 'e', type: String },
  { name: 'schema', alias: 's', type: String },
  { name: 'operationName', alias: 'n', type: String },
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
