#!/usr/bin/env node

import commandLineArgs from 'command-line-args';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';
import { IGraphQLRequestData, IOptionData } from './types';
import { helpText } from './help';

function getOpenCommand() {
  switch (process.platform) {
    case 'darwin':
      return 'open';
    case 'win32':
      return 'start';
    default:
      return 'xdg-open';
  }
}

function openUrl(url: string) {
  const openCmd = getOpenCommand();
  childProcess.exec(`${openCmd} ${url}`);
}

async function makeRequestAndOpenData(options: IOptionData) {
  const data: IGraphQLRequestData = {
    query: fs.readFileSync(options.schema).toString(),
  };

  if (options.operationName) {
    data.operationName = options.operationName;
  }

  if (options.variables) {
    // TODO: test me
    const variables = fs.readFileSync(options.variables).toString();
    data.variables = JSON.parse(variables);
  }

  try {
    const response = await axios({
      method: 'POST',
      url: options.endpoint,
      data,
      headers: {
        'x-trace': 'true',
      },
    });

    // TODO: print error if no extensions.traces field
    // msg: "No traces found, is the plugin installed properly?"

    // TODO: allow custom output file name in options, use tmp if doesn't exist
    const tmpFileName = `tmp-${Math.random().toString().replace('.', '')}.json`;
    fs.writeFileSync(
      tmpFileName,
      JSON.stringify(response.data.extensions.traces)
    );

    openData({ data: tmpFileName } as IOptionData);
  } catch (e) {
    console.error((e as Error).message);
    // TODO: not every error has response, only show if it exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.error((e as any).response.data);
  }
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
