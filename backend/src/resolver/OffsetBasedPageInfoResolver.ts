import {
  ResolverInterface, Root, Resolver, FieldResolver
} from "type-graphql";

import { OffsetBasedPageInfo } from "../type";

@Resolver(() => OffsetBasedPageInfo)
export class OffsetBasedPageInfoResolver implements ResolverInterface<OffsetBasedPageInfo> {
  @FieldResolver()
  hasPreviousPage(@Root() pageInfo: OffsetBasedPageInfo): boolean {
    return pageInfo.total > 0 && pageInfo.skip > 0;
  }

  @FieldResolver()
  hasNextPage(@Root() pageInfo: OffsetBasedPageInfo): boolean {
    return pageInfo.skip + pageInfo.take < pageInfo.total;
  }
}
