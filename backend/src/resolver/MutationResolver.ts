import { Mutation, Resolver } from "type-graphql";

import { UserMutations } from "../type";

@Resolver()
export class MutationResolver {
  @Mutation()
  user(): UserMutations {
    return new UserMutations();
  }
}
