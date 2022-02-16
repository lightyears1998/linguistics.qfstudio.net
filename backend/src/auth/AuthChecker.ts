import { ApolloError } from "apollo-server";
import { AuthChecker } from "type-graphql";

import { AppUserContext } from "../context";

export const authChecker: AuthChecker<AppUserContext> = async ({ context: ctx }, roles) => {
  const user = ctx.getSessionUser();

  if (!user) {
    throw new ApolloError("用户未登录或登录已过期", "CLIENT_NOT_LOGIN");
  }

  if (roles.length === 0) {
    return true;
  }

  if (roles.indexOf("admin") !== -1) {
    if (!user.isAdmin) {
      throw new ApolloError("用户需要管理员权限以访问此接口", "USER_SHOULD_BE_ADMIN");
    }
    return true;
  }

  throw new ApolloError("鉴权中间件异常", "MALFUNCTION_AUTH_MIDDLEWARE");
};
