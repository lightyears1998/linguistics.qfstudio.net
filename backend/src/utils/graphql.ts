import {
  DocumentNode, ExecutionResult, graphql, GraphQLSchema
} from "graphql";
import Container from "typedi";

export function doGraphql(args: string | DocumentNode): Promise<ExecutionResult> {
  const schema = Container.get<GraphQLSchema>("graphql-schema");
  if (typeof args !== "string") {
    args = args.loc && args.loc.source.body || "";
  }
  return graphql(schema, args);
}
