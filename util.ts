import type { GraphQLField, GraphQLSchema } from 'graphql';
import type { IGraphQLNamedType } from './types';

import { isIntrospectionType } from 'graphql';

export const nsToMs = (nanoseconds: bigint) => {
  return Number(nanoseconds / BigInt(1000000));
};

export function useResolverDecorator(schema: GraphQLSchema, fn: Function) {
  for (const typeName in schema.getTypeMap()) {
    const type = schema.getType(typeName) as IGraphQLNamedType;

    if (!isIntrospectionType(type)) {
      applyResolverToType(type, fn);
    }
  }
}

function applyResolverToType(type: IGraphQLNamedType, fn: Function) {
  if (type.getFields) {
    const fields = type.getFields();

    for (const fieldName in fields) {
      const field = fields[fieldName] as GraphQLField<any, any>;

      if (field.resolve) {
        field.resolve = fn(field.resolve);
      }
    }
  }
}
