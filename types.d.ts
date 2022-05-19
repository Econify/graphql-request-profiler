export interface IResolverTrace {
  execTimeMs: number; // The amount of time the resolver function call took
  execStartTimeMs: number; // The amount of time after the request began to when the resolver was called
  execEndTimeMs: number; // The amount of time after the request began to the resolver call finishing
  location: string; // Location in schema for this resolver
  parentType: string; // Type of parent the resolver was called for
}

export interface IGraphQLOptions {
  schema: any;
  context: any;
  extensions: any;
  request?: any;
}

export type IGraphQLNamedType = GraphQLNamedType & {
  getFields?: () => GraphQLInputFieldMap;
};

export interface IApolloPluginOptions {
  headerName?: string;
}
