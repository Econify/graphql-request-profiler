#!/usr/bin/env ts-node

import commandLineArgs from 'command-line-args';
import fs from 'fs';
import path from 'path';
import { IOptionData } from './types';
import childProcess from 'child_process';
import {
  getOpenCommand,
  getRequestBody,
  openUrl,
  printHelp,
  requestGraphQL,
} from './util';

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

  await openData({ ...options, data: fileName } as IOptionData);
}

function webserver() {
  return (res: Function, rej: (error: Error) => void) => {
    const port = String(options.port || 8080);

    const server = childProcess.spawn('npx', [
      'serve',
      path.join(__dirname, '../dist/public'),
      '-l',
      port,
    ]);

    server.on('close', (code) => {
      if (code !== 0) {
        rej(new Error(`Server exited with code ${code}`));
      } else {
        res();
      }
    });

    server.stdout.on('data', (data) => {
      if (data.toString().match(/Accepting connections/)) {
        childProcess.exec(`${getOpenCommand()} http://localhost:${port}`);
      }
    });

    server.stderr.on('data', (data) => {
      console.error(data.toString());
    });
  };
}

async function openData(options: IOptionData) {
  if (!options.data) {
    throw new Error('No data file specified');
  }

  const pathToWrite = path.join(__dirname, '../dist/public/data.js');

  const dataContents = await fs.promises.readFile(options.data);

  await fs.promises.writeFile(
    pathToWrite,
    `/* eslint-disable no-undef */\nwindow.data = ${dataContents.toString()}`
  );

  if (!options.output) {
    await fs.promises.rm(options.data);
  }

  return new Promise(webserver());
}

const options = commandLineArgs([
  { name: 'output', alias: 'o', type: String },
  { name: 'endpoint', alias: 'e', type: String },
  { name: 'schema', alias: 's', type: String },
  { name: 'operationName', alias: 'n', type: String },
  { name: 'variables', alias: 'v', type: String },
  { name: 'data', alias: 'd', type: String },
  { name: 'headerName', alias: 'h', type: String },
  { name: 'port', alias: 'p', type: Number },
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

    await printHelp();
    process.exit(0);
  } catch (e) {
    console.error(`Error: ${(e as Error).message}`);
    process.exit(1);
  }
})();
