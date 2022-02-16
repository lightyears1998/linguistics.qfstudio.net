import { Field, ObjectType } from "type-graphql";

import { User } from "../../entity";
import { OffsetBasedPageInfo } from "../PageInfo";

import { OffsetBasedConnection } from "./Connection";

@ObjectType()
export class UsersConnection implements OffsetBasedConnection {
  @Field(() => [User])
  nodes!: User[]

  @Field(() => OffsetBasedPageInfo)
  pageInfo!: OffsetBasedPageInfo
}
