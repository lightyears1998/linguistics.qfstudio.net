import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class CursorBasedPageInfo {
  @Field({ nullable: false })
  hasPreviousPage!: boolean;

  @Field({ nullable: false })
  hasNextPage!: boolean;

  @Field({ nullable: false })
  startCursor!: string;

  @Field({ nullable: false })
  endCursor!: string;
}
