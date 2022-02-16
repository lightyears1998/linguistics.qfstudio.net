import {
  Query, Resolver, Ctx, Arg, Int, Authorized
} from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { User } from "../../entity";
import { AppUserContext } from "../../context";
import { UserRepository } from "../../repo";
import { UsersConnection } from "../../type";

@Resolver(() => User)
export class UserResolver {
  @InjectRepository()
  private readonly userRepository!: UserRepository

  @Authorized()
  @Query(() => User, { description: "查询用户信息；若用户未登录，将返回 `CLIENT_NOT_LOGIN` 异常。" })
  async me(@Ctx() ctx: AppUserContext): Promise<User | undefined> {
    return ctx.getSessionUser();
  }

  @Query(() => Boolean, { description: "查询用户名可用性" })
  async usernameAvailable(@Arg("username") username: string): Promise<boolean> {
    const user = await this.userRepository.manager.findOne(User, { where: { username: username }, select: ["userId"] });
    return user === undefined;
  }

  @Query(() => UsersConnection, {
    complexity: ({ args, childComplexity }) => {
      return 1 + childComplexity * (args.take ?? 0);
    },
    description: "查询用户列表"
  })
  async users(
    @Arg("skip", () => Int, { nullable: true, defaultValue: 0 }) skip: number,
    @Arg("take", () => Int, { nullable: true, defaultValue: 20 }) take: number
  ): Promise<UsersConnection> {
    const users = await this.userRepository.find({ skip, take });
    const total = await this.userRepository.count();

    return {
      nodes: users,
      pageInfo: {
        skip, take, total
      }
    };
  }
}
