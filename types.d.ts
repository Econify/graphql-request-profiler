/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GraphQLFieldResolver } from 'graphql';
import type { IncomingMessage } from 'http';
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

export interface IPluginOptions {
  headerName?: string;
}

export type TraceFunction = (fn: ResolverFunction) => ResolverFunction;

export type ResolverFunction = GraphQLFieldResolver<any, any, any>;

export type SymbolObject = Record<symbol, any>;

export interface IGraphQLRequestData {
  query: string;
  operationName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: Record<string, any>;
}

export interface IOptionData {
  endpoint: string;
  schema: string;
  operationName: string;
  variables: string;
  output: string;
  data: string;
  help: boolean;
  headerName: string;
}

interface IGraphQLResponse {
  data: any;
  extensions?: ReturnType<typeof getResolverTraces>;
}

export type IExpressGraphQLRequest = IncomingMessage & {
  url: string;
};
