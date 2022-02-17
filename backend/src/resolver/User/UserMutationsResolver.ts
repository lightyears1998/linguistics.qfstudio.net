import {
  Resolver, Ctx, Arg, Authorized, FieldResolver
} from "type-graphql";
import { Inject } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server";

import { User } from "../../entity";
import { AppContext, AppUserContext } from "../../context";
import { UserRepository } from "../../repo";
import { UserService } from "../../service";
import { UserMutations } from "../../type";

@Resolver(() => UserMutations)
export class UserMutationsResolver {
  @InjectRepository()
  private readonly userRepository!: UserRepository

  @Inject()
  private readonly userService!: UserService

  @FieldResolver(() => User, { description: "用户注册" })
  async signUp(
    @Ctx() ctx: AppUserContext,
    @Arg("username", { description: "用户名" }) username: string,
    @Arg("password", { description: "密码" }) password: string,
  ): Promise<User> {
    throw "Unimplemented";
    const user = await this.userService.registerUser(username, password);
    ctx.setSessionUser(user);
    return user;
  }

  @FieldResolver(() => User, { nullable: true, description: "用户登录" })
  async signIn(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() ctx: AppContext
  ): Promise<User> {
    const user = await this.userRepository.findOne({ username });

    if (!user) {
      throw new ApolloError("用户不存在。", "WRONG_USERNAME");
    }

    if (!(await this.userService.matchPassword(user, password))) {
      throw new ApolloError("用户名或密码错误。", "WRONG_USERNAME_OR_PASSWORD");
    }

    if (ctx.session) {
      ctx.session.userId = user.userId;
    }
    return user;
  }

  @FieldResolver(() => Boolean, { description: "用户注销" })
  async signOut(@Ctx() ctx: AppContext): Promise<boolean> {
    ctx.session = null;
    return true;
  }

  @Authorized()
  @FieldResolver(() => Boolean, { description: "修改密码" })
  async updatePassword(
    @Ctx() ctx: AppUserContext,
    @Arg("newPassword") newPassword: string,
    @Arg("oldPassword") oldPassword: string
  ): Promise<boolean> {
    const user = ctx.getSessionUser() as User;
    if (!(await this.userService.matchPassword(user, oldPassword))) {
      throw new ApolloError("旧密码错误。");
    }

    await this.userService.updatePassword(user, newPassword);
    return true;
  }
}
