import { Service } from "typedi";
import {
  EntityManager, EntityRepository, Repository
} from "typeorm";
import { InjectManager } from "typeorm-typedi-extensions";

import { User } from "../entity";

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  @InjectManager()
  manager!: EntityManager

  async findById(id: number): Promise<User | undefined> {
    return this.findOne({ where: { userId: id } });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.findOne({ where: { username } });
  }
}
