import type { GraphQLFieldResolver } from 'graphql';
import type { IGraphQLOptions, IApolloPluginOptions } from './types';

import { responsePathAsArray } from 'graphql';
import { nsToMs, useResolverDecorator } from './util';

const SYMBOL_START_TIME = Symbol('SYMBOL_START_TIME');
const SYMBOL_TRACES = Symbol('SYMBOL_TRACES');

export const createProfilerOptions = (options: IGraphQLOptions) => {
  if (!options.context) {
    options.context = {};
  }

  // Does this affect apollo?
  options.extensions = ({ context }: any) => ({
    ...getResolverTraces(context),
  });

  addStartTime(options);

  useResolverDecorator(options.schema, trace);

  return options;
};

export function createProfilerPlugin(options: IApolloPluginOptions) {
  return {
    headerName: 'x-trace',

    // TODO: type me
    async serverWillStart(options: any) {
      createProfilerOptions(options);
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
            ...getResolverTraces(options.context),
          };
        },
      };
    },
  };
}

const getResolverTraces = (context: IGraphQLOptions['context']) => {
  return {
    totalTimeMs: nsToMs(process.hrtime.bigint() - context[SYMBOL_START_TIME]),
    traces: context[SYMBOL_TRACES],
  };
};

const addStartTime = (options: IGraphQLOptions) => {
  const { context } = options;

  context[SYMBOL_START_TIME] = process.hrtime.bigint();
};

function trace(
  fn: GraphQLFieldResolver<any, any, any>
): GraphQLFieldResolver<any, any, any> {
  return async function (this: any, data, args, context, info) {
    const reqStartTime = context[SYMBOL_START_TIME];

    if (!reqStartTime) {
      return fn.call(this, data, args, context, info);
    }

    const startTime = process.hrtime.bigint();
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
