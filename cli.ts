#!/usr/bin/env node

import commandLineArgs from 'command-line-args';
import fs from 'fs';
import path from 'path';
import { IOptionData } from './types';
import { getRequestBody, openUrl, printHelp, requestGraphQL } from './util';

async function makeRequestAndOpenData(options: IOptionData) {
  const requestBody = await getRequestBody(options);
  const response = await requestGraphQL(requestBody, options);

  if (!response.data?.extensions?.traces) {
    throw new Error('No traces found, is the plugin installed properly?');
  }

  const fileName =
    options.output || `tmp-${Math.random().toString().replace('.', '')}.json`;

  await fs.promises.writeFile(
    fileName,
    JSON.stringify(response.data.extensions.traces)
  );

  await openData({ data: fileName } as IOptionData);

  if (!options.output) {
    await fs.promises.rm(fileName);
  }
}

async function openData(options: IOptionData) {
  const pathToWrite = path.join(__dirname, 'viz/data.js');

  const dataContents = await fs.promises.readFile(options.data);

  await fs.promises.writeFile(
    pathToWrite,
    `/* eslint-disable no-undef */\nwindow.data = ${dataContents.toString()}`
  );

  openUrl(path.join(__dirname, 'viz/index.html'));
}

const options = commandLineArgs([
  { name: 'output', alias: 'o', type: String },
  { name: 'endpoint', alias: 'e', type: String },
  { name: 'schema', alias: 's', type: String },
  { name: 'operationName', alias: 'n', type: String },
  { name: 'variables', alias: 'v', type: String },
  { name: 'data', alias: 'd', type: String },
  { name: 'headerName', alias: 'h', type: String },
  { name: 'help', type: Boolean },
]) as IOptionData;

(async () => {
  try {
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
  } catch (e) {
    console.error(`Error: ${(e as Error).message}`);
  }
})();
