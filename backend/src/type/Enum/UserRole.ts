import { registerEnumType } from "type-graphql";

export enum UserRole {
  /** 消费者 */
  CONSUMER = "CONSUMER",

  /** 原料供应商 */
  RAW_MATERIAL_SUPPLIER = "RAW_MATERIAL_SUPPLIER",

  /** 药品商家 */
  MERCHANT = "MERCHANT",

  /** 监管部门 */
  REGULATORY_AUTHORITY = "REGULATORY_AUTHORITY",

  /** 骑手 */
  RIDER = "RIDER",

  /** 药品厂商 */
  MANUFACTURER = "MANUFACTURER",

  /** 经销商 */
  DEALER = "DEALER",
}

registerEnumType(UserRole, { name: "用户角色", description: "用户角色" });
