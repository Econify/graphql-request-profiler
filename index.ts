import type {
  GraphQLSchema,
  GraphQLField,
  GraphQLFieldResolver,
} from 'graphql';
import { responsePathAsArray } from 'graphql';
import {
  IGraphQLNamedType,
  IGraphQLOptions,
  IGraphQLRequestInfo,
} from './types';

const nsToMs = (nanoseconds: bigint) => {
  return Number(nanoseconds / BigInt(1000000));
};

const SYMBOL_START_TIME = Symbol('SYMBOL_START_TIME');
const SYMBOL_TRACES = Symbol('SYMBOL_TRACES');

export const addResolverTraceExtension = (options: any) => {
  const timeBasis = process.hrtime.bigint();
  useTraceDecorator(options.schema);

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

function useTraceDecorator(schema: GraphQLSchema) {
  for (const typeName in schema.getTypeMap()) {
    const type = schema.getType(typeName) as IGraphQLNamedType;
    applyTraceToType(type);
  }
}

function applyTraceToType(type: IGraphQLNamedType) {
  if (type.getFields) {
    const fields = type.getFields();

    for (const fieldName in fields) {
      const field = fields[fieldName] as GraphQLField<any, any>;

      if (field.resolve) {
        field.resolve = trace(field.resolve);
      }
    }
  }
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
