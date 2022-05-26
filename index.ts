import type {
  Context,
  IPluginOptions,
  ResolverFunction,
  IExpressGraphQLRequest,
} from './types';
import type { OptionsData, RequestInfo } from 'express-graphql';
import type {
  BaseContext,
  GraphQLServiceContext,
  GraphQLRequestContext,
  GraphQLRequestContextWillSendResponse,
} from 'apollo-server-types';

import { responsePathAsArray } from 'graphql';
import { nsToMs, useResolverDecorator } from './util';

const SYMBOL_START_TIME = Symbol('SYMBOL_START_TIME');
const SYMBOL_TRACES = Symbol('SYMBOL_TRACES');

export function createExpressProfilerPlugin(
  req: IExpressGraphQLRequest,
  options: OptionsData,
  config?: IPluginOptions
) {
  if (req.headers[config?.headerName || 'x-trace'] === 'true') {
    if (!options.context) {
      options.context = {};
    }

    options.extensions = decorateExtensions(options.extensions);

    addStartTime(options);

    useResolverDecorator(options.schema, trace);
  }

  return options;
}

export function createApolloProfilerPlugin(options?: IPluginOptions) {
  return {
    headerName: options?.headerName || 'x-trace',

    async serverWillStart(options: GraphQLServiceContext) {
      createApolloProfilerOptions(options);
    },

    async requestDidStart(options: GraphQLRequestContext) {
      if (options?.request?.operationName === 'IntrospectionQuery') {
        return;
      }

      if (options?.request?.http?.headers.get(this.headerName) === 'true') {
        addStartTime(options);

        return {
          async willSendResponse(
            options: GraphQLRequestContextWillSendResponse<BaseContext>
          ) {
            options.response.extensions = {
              ...options.response.extensions,
              ...getResolverTraces(options.context),
            };
          },
        };
      }
    },
  };
}

function createApolloProfilerOptions(options: GraphQLServiceContext) {
  useResolverDecorator(options.schema, trace);
  return options;
}

function getResolverTraces(context: Context) {
  return {
    totalTimeMs: nsToMs(process.hrtime.bigint() - context[SYMBOL_START_TIME]),
    traces: context[SYMBOL_TRACES],
  };
}

function addStartTime(options: OptionsData | GraphQLRequestContext) {
  const { context } = options as { context: Context };

  context[SYMBOL_START_TIME] = process.hrtime.bigint();
}

function decorateExtensions(fn?: OptionsData['extensions']) {
  if (fn) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (this: any, info: RequestInfo) {
      const baseExtensionsData = fn.call(this, info);
      const { context } = info;
      return {
        ...baseExtensionsData,
        ...getResolverTraces(context as Context),
      };
    };
  }

  return ({ context }: RequestInfo) => ({
    ...getResolverTraces(context as Context),
  });
}

function trace(fn: ResolverFunction): ResolverFunction {
  if (fn.name !== 'graphQLRequestProfilerWrapperFn') {
    return async function graphQLRequestProfilerWrapperFn(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this: any,
      data,
      args,
      context,
      info
    ) {
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

  return fn;
}
