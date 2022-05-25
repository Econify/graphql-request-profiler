#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const commandLineArgs = require('command-line-args');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

function getOpenCommand() {
  switch (process.platform) {
    case 'darwin':
      return 'open';
    case 'win32':
      return 'start';
    default:
      // Take an educated guess for Linux
      return 'xdg-open';
  }
}

function openUrl(url) {
  const openCmd = getOpenCommand()
  childProcess.exec(`${openCmd} ${url}`);
}

async function makeRequestAndOpenData(options) {
  const data = {
    query: fs.readFileSync(options.schema).toString(),
  }

  if (options.operationName) {
    data.operationName = options.operationName;
  }

  if (options.variables) {
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
      }
    });

    // TODO: better place to store this?
    const tmpFileName = `tmp-${Math.random().toString().replace('.', '')}.json`;
    fs.writeFileSync(tmpFileName, JSON.stringify(response.data.extensions.traces))
    openData({ dataRaw: JSON.stringify(response.data.extensions.traces) })
  } catch (e) {
    console.error(e.message)
    console.error(e.response.data)
  }
}

function printHelp() {
  console.log('Help menu coming soon :)')
}

function openData(options) {
  const pathToWrite = path.join(__dirname, '..', 'viz/data.js');

  const dataContents = fs.readFileSync(options.data).toString();
  fs.writeFileSync(pathToWrite, `/* eslint-disable no-undef */\nwindow.data = ${dataContents}`);

  openUrl(path.join(__dirname, '..', 'viz/index.html'));
}

const options = commandLineArgs([
  { name: 'endpoint', alias: 'e', type: String },
  { name: 'schema', alias: 's', type: String },
  { name: 'operationName', alias: 'o', type: String },
  { name: 'variables', alias: 'v', type: String },
  { name: 'data', alias: 'd', type: String },
  { name: 'help', type: Boolean }
]);

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
})()
