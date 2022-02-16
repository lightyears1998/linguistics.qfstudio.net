import { Inject, Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { ApolloError } from "apollo-server";

import { User } from "../entity";
import { UserRepository } from "../repo";

@Service()
export class UserService {
  @InjectRepository()
  private readonly userRepository!: UserRepository

  async registerUser(username: string, password: string, invitationCode?: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

    let user: User;
    try {
      user = await this.userRepository.save(this.userRepository.create({
        username,
        passwordHash
      }));
    } catch (e) {
      if ((e as { code: string}).code === "23505") {
        throw new ApolloError("用户名已被占用。", "REGISTRATION_USERNAME_NOT_AVAILABLE");
      }
      throw e;
    }

    return user;
  }

  async matchPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  async updatePassword(user: User, password: string): Promise<void> {
    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());
    user.passwordHash = passwordHash;
    await this.userRepository.save(user);
  }
}
