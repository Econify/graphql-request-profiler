/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GraphQLFieldResolver } from 'graphql';
export interface IResolverTrace {
  execTimeMs: number;
  execStartTimeMs: number;
  execEndTimeMs: number;
  location: string;
  parentType: string;
}

export type GraphQLNamedType = GraphQLNamedType & {
  getFields?: () => GraphQLInputFieldMap;
};

export interface IApolloPluginOptions {
  headerName?: string;
}

export type TraceFunction = (fn: ResolverFunction) => ResolverFunction;

export type ResolverFunction = GraphQLFieldResolver<any, any, any>;

export type Context = Record<symbol, any>;
