import type { AxiosError } from 'axios';
import type { GraphQLField, GraphQLSchema } from 'graphql';
import type {
  GraphQLNamedType,
  IGraphQLRequestData,
  IOptionData,
  TraceFunction,
} from './types';

import { isIntrospectionType } from 'graphql';
import childProcess from 'child_process';
import axios from 'axios';
import fs from 'fs';

export const nsToMs = (nanoseconds: bigint) => {
  return Number(nanoseconds / BigInt(1000000));
};

export function useResolverDecorator(schema: GraphQLSchema, fn: TraceFunction) {
  for (const typeName in schema.getTypeMap()) {
    const type = schema.getType(typeName) as GraphQLNamedType;

    if (!isIntrospectionType(type)) {
      applyResolverToType(type, fn);
    }
  }
}

function applyResolverToType(type: GraphQLNamedType, fn: TraceFunction) {
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
) {
  try {
    return axios({
      method: 'POST',
      url: options.endpoint,
      data,
      headers: {
        'x-trace': 'true',
      },
    });
  } catch (e) {
    const error = <AxiosError>e;

    if (error?.response?.data) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }

    throw e;
  }
}

function parseVariables(data: IGraphQLRequestData, options: IOptionData) {
  const variables = fs.readFileSync(options.variables).toString();
  data.variables = JSON.parse(variables);
}

export function getRequestBody(options: IOptionData) {
  const data: IGraphQLRequestData = {
    query: fs.readFileSync(options.schema).toString(),
  };

  if (options.operationName) {
    data.operationName = options.operationName;
  }

  if (options.variables) {
    parseVariables(data, options);
  }

  return data;
}
