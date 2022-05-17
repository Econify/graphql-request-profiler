import type {
  GraphQLResolveInfo,
  GraphQLSchema,
  GraphQLField,
  GraphQLFieldResolver,
} from 'graphql';
import { responsePathAsArray } from 'graphql';
import {
  IDecoratorFunction,
  IGraphQLContext,
  IGraphQLNamedType,
  IGraphQLOptions,
  IGraphQLRequestInfo,
} from './types';

const nsToMs = (nanoseconds: bigint) => {
  return Number(nanoseconds / BigInt(1000000));
};

const CONTEXT_START_TIME = Symbol('CONTEXT_START_TIME');
const CONTEXT_TRACES = Symbol('CONTEXT_TRACES');

export const addResolverTraceExtension = (options: IGraphQLOptions) => {
  const timeBasis = process.hrtime.bigint();
  useResolverDecorator(options.schema, trace);

  // TODO: use symbols
  (options.context as any).startTime = timeBasis;
  return useTraceExtension(options);
};

function useTraceExtension(options: IGraphQLOptions) {
  options.extensions = ({ context }: IGraphQLRequestInfo) => {
    const { startTimeNs, traces } = context as IGraphQLContext;
    return {
      totalTimeMs: nsToMs(process.hrtime.bigint() - startTimeNs),
      traces,
    };
  };

  return options;
}

function useResolverDecorator(schema: GraphQLSchema, fn: IDecoratorFunction) {
  for (const typeName in schema.getTypeMap()) {
    const type = schema.getType(typeName) as IGraphQLNamedType;
    applyResolverToType(type, fn);
  }
}

function applyResolverToType(type: IGraphQLNamedType, fn: IDecoratorFunction) {
  if (type.getFields) {
    const fields = type.getFields();

    for (const fieldName in type.getFields()) {
      const field = fields[fieldName] as GraphQLField<any, any, any>;

      if (field.resolve) {
        field.resolve = fn(field.resolve);
      }
    }
  }
}

export function trace(
  fn: GraphQLFieldResolver<any, any, any>
): GraphQLFieldResolver<any, any, any> {
  return async function (
    data,
    args,
    context: IGraphQLContext,
    info: GraphQLResolveInfo
  ) {
    const startTime = process.hrtime.bigint();
    // @ts-ignore // TODO: fix me
    const result = await fn.call(this, data, args, context, info);
    const endTime = process.hrtime.bigint();

    if (!context.traces) {
      context.traces = [];
    }

    const timeMs = nsToMs(endTime - startTime);
    const reqStartTime = context.startTimeNs;

    if (timeMs > 0) {
      context.traces.push({
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
