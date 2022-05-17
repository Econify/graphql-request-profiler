import { trace } from '.';

interface IResolverTrace {
  execTimeMs: number; // The amount of time the resolver function call took
  execStartTimeMs: number; // The amount of time after the request began to when the resolver was called
  execEndTimeMs: number; // The amount of time after the request began to the resolver call finishing
  location: string; // Location in schema for this resolver
  parentType: string; // Type of parent the resolver was called for
}

interface IGraphQLOptions {
  // TODO: type me
  schema: any;
  context: any;
  extensions: any;
}

interface IGraphQLRequestInfo {
  context: IGraphQLContext;
}

interface IGraphQLContext {
  // TODO: type me
  traces: Array<IResolverTrace>;
  startTimeNs: bigint;
}

type IGraphQLNamedType = GraphQLNamedType & {
  getFields?: () => GraphQLInputFieldMap;
};

type IDecoratorFunction = typeof trace;
