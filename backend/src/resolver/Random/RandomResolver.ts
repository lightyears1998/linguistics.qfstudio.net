import { Query, Resolver } from "type-graphql";
import { InjectManager } from "typeorm-typedi-extensions";
import { EntityManager, Not } from "typeorm";

import { Song } from "../../entity/Song";

@Resolver()
export class RandomResolver {
  @InjectManager()
  private readonly manager!: EntityManager

  @Query(() => Song)
  async randomSong(): Promise<Song> {
    const song = await this.manager.createQueryBuilder(Song, "song").where({ lyrics: Not("") }).orderBy("RANDOM()").limit(1).getOne();
    return song as Song;
  }
}
