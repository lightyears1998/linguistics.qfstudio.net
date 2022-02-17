import {
  Query, Resolver, Ctx, Arg, Int, Authorized
} from "type-graphql";
import { InjectManager, InjectRepository } from "typeorm-typedi-extensions";
import { EntityManager } from "typeorm";

import { User } from "../../entity";
import { AppUserContext } from "../../context";
import { UserRepository } from "../../repo";
import { UsersConnection } from "../../type";
import { Song } from "../../entity/Song";

@Resolver(() => Song)
export class SongResolver {
  @InjectManager()
  private readonly manager!: EntityManager

  @Query(() => [Song])
  async songs(): Promise<Song[]> {
    return this.manager.find(Song);
  }
}
