import {
  Field, Int, ObjectType
} from "type-graphql";

import { PageInfo } from "./PageInfo";

@ObjectType()
export class OffsetBasedPageInfo implements PageInfo {
  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  skip!: number;

  @Field(() => Int)
  take!: number;

  @Field(() => Boolean, { nullable: false })
  hasPreviousPage?: boolean

  @Field(() => Boolean, { nullable: false })
  hasNextPage?: boolean;
}
