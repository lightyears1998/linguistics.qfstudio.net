import { Mutation, Resolver } from "type-graphql";

import { DrugMutations, UserMutations } from "../type";

@Resolver()
export class MutationResolver {
  @Mutation()
  user(): UserMutations {
    return new UserMutations();
  }

  @Mutation()
  drug(): DrugMutations {
    return new DrugMutations();
  }
}
