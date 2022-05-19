import type { GraphQLFieldResolver } from 'graphql';
import type { IGraphQLOptions, IApolloPluginOptions } from './types';

import { responsePathAsArray } from 'graphql';
import { nsToMs, useResolverDecorator } from './util';

const SYMBOL_START_TIME = Symbol('SYMBOL_START_TIME');
const SYMBOL_TRACES = Symbol('SYMBOL_TRACES');

export const getTraces = (context: IGraphQLOptions['context']) => {
  return {
    totalTimeMs: nsToMs(process.hrtime.bigint() - context[SYMBOL_START_TIME]),
    traces: context[SYMBOL_TRACES],
  };
};

export const createTraceableSchema = (options: IGraphQLOptions) => {
  if (!options.context) {
    options.context = {};
  }

  addStartTime(options);

  useResolverDecorator(options.schema, trace);

  return options;
};

const addStartTime = (options: IGraphQLOptions) => {
  const { context } = options;

  context[SYMBOL_START_TIME] = process.hrtime.bigint();
};

export function createProfilerPlugin(options: IApolloPluginOptions) {
  return {
    headerName: 'x-profile-request',

    // TODO: type me
    async serverWillStart(options: any) {
      createTraceableSchema(options);
    },

    // TODO: type me
    async requestDidStart(options: any) {
      if (options?.request?.operationName === 'IntrospectionQuery') {
        return;
      }

      if (options?.request?.http.headers.get(this.headerName) !== 'true') {
        return;
      }

      addStartTime(options);

      return {
        async willSendResponse(options: any) {
          options.response.extensions = {
            ...options.response.extensions,
            ...getTraces(options.context),
          };
        },
      };
    },
  };
}

function trace(
  fn: GraphQLFieldResolver<any, any, any>
): GraphQLFieldResolver<any, any, any> {
  return async function (data, args, context, info) {
    const reqStartTime = context[SYMBOL_START_TIME];

    if (!reqStartTime) {
      // @ts-ignore // TODO: fix me
      return fn.call(this, data, args, context, info);
    }

    const startTime = process.hrtime.bigint();
    // @ts-ignore // TODO: fix me
    const result = await fn.call(this, data, args, context, info);
    const endTime = process.hrtime.bigint();

    if (!context[SYMBOL_TRACES]) {
      context[SYMBOL_TRACES] = [];
    }

    const execTimeMs = nsToMs(endTime - startTime);

    if (execTimeMs > 0) {
      context[SYMBOL_TRACES].push({
        execTimeMs,
        execStartTimeMs: nsToMs(startTime - reqStartTime),
        execEndTimeMs: nsToMs(endTime - reqStartTime),
        location: responsePathAsArray(info.path).join('.'),
        parentType: info.parentType.toString(),
      });
    }

    return result;
  };
}
