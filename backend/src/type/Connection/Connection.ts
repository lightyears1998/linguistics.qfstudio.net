import { OffsetBasedPageInfo } from "../PageInfo/OffsetBasedPageInfo";

export interface OffsetBasedConnection {
  nodes: Array<unknown>
  pageInfo: OffsetBasedPageInfo
}
