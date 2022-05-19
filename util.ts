import type { GraphQLField, GraphQLSchema } from 'graphql';
import type { GraphQLNamedType, TraceFunction } from './types';

import { isIntrospectionType } from 'graphql';

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
