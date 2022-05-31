import type { AxiosResponse } from 'axios';
import type { GraphQLField, GraphQLSchema } from 'graphql';
import type {
  IGraphQLNamedType,
  IGraphQLRequestData,
  IGraphQLResponse,
  IOptionData,
  TraceFunction,
} from './types';

import { isIntrospectionType } from 'graphql';
import childProcess from 'child_process';
import axios from 'axios';
import fs from 'fs';

import { helpText } from './help';

export const nsToMs = (nanoseconds: bigint) => {
  return Number(nanoseconds / BigInt(1000000));
};

export function useResolverDecorator(schema: GraphQLSchema, fn: TraceFunction) {
  for (const typeName in schema.getTypeMap()) {
    const type = schema.getType(typeName) as IGraphQLNamedType;

    if (!isIntrospectionType(type)) {
      applyResolverToType(type, fn);
    }
  }
}

function applyResolverToType(type: IGraphQLNamedType, fn: TraceFunction) {
  if (type.getFields) {
    const fields = type.getFields();

    for (const fieldName in fields) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const field = fields[fieldName] as GraphQLField<any, any>;

      if (field.resolve) {
        field.resolve = fn(field.resolve);
      }
    }
  }
}

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

export function openUrl(url: string) {
  const openCmd = getOpenCommand();
  childProcess.exec(`${openCmd} ${url}`);
}

export async function requestGraphQL(
  data: IGraphQLRequestData,
  options: IOptionData
): Promise<AxiosResponse<IGraphQLResponse>> {
  return axios({
    method: 'POST',
    url: options.endpoint,
    data,
    headers: {
      [options.headerName || 'x-trace']: 'true',
    },
  });
}

async function parseVariables(data: IGraphQLRequestData, options: IOptionData) {
  const variables = await fs.promises.readFile(options.variables);
  data.variables = JSON.parse(variables.toString());
}

export async function getRequestBody(options: IOptionData) {
  const data: IGraphQLRequestData = {
    query: (await fs.promises.readFile(options.schema)).toString(),
  };

  if (options.operationName) {
    data.operationName = options.operationName;
  }

  if (options.variables) {
    await parseVariables(data, options);
  }

  return data;
}

export function printHelp() {
  console.log(helpText());
}
