import { responsePathAsArray } from 'graphql';
import type { GraphQLFieldResolver } from 'graphql';
import type { IGraphQLOptions, IGraphQLRequestInfo } from './types';
import { nsToMs, useResolverDecorator } from './util';

const SYMBOL_START_TIME = Symbol('SYMBOL_START_TIME');
const SYMBOL_TRACES = Symbol('SYMBOL_TRACES');

export const addResolverTraceExtension = (options: any) => {
  const timeBasis = process.hrtime.bigint();
  useResolverDecorator(options.schema, trace);

  options[SYMBOL_START_TIME] = timeBasis;
  return useTraceExtension(options);
};

function useTraceExtension(options: IGraphQLOptions) {
  options.extensions = ({ context }: IGraphQLRequestInfo) => ({
    totalTimeMs: nsToMs(process.hrtime.bigint() - context[SYMBOL_START_TIME]),
    traces: context[SYMBOL_TRACES],
  });

  return options;
}

function trace(
  fn: GraphQLFieldResolver<any, any, any>
): GraphQLFieldResolver<any, any, any> {
  return async function (data, args, context, info) {
    const startTime = process.hrtime.bigint();
    // @ts-ignore // TODO: fix me
    const result = await fn.call(this, data, args, context, info);
    const endTime = process.hrtime.bigint();

    if (!context[SYMBOL_TRACES]) {
      context[SYMBOL_TRACES] = [];
    }

    const timeMs = nsToMs(endTime - startTime);
    const reqStartTime = context[SYMBOL_START_TIME];

    if (timeMs > 0) {
      context[SYMBOL_TRACES].push({
        execStartTimeMs: nsToMs(startTime - reqStartTime),
        execEndTimeMs: nsToMs(endTime - reqStartTime),
        execTimeMs: nsToMs(endTime - startTime),
        location: responsePathAsArray(info.path).join('.'),
        parentType: info.parentType.toString(),
      });
    }

    return result;
  };
}
