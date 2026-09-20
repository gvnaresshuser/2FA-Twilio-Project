import { AppDataSource } from "../config/database.js";
import { TwofaUser } from "../entities/TwofaUser.js";

export class TwofaUserRepository {
  private repository = AppDataSource.getRepository(TwofaUser);

  async findByEmail(email: string): Promise<TwofaUser | null> {
    return this.repository.findOne({
      where: { email },
    });
  }

  async createUser(
    name: string,
    email: string,
    password: string,
    mobile: string,
  ): Promise<TwofaUser> {
    const user = this.repository.create({
      name,
      email,
      password,
      mobile,
    });

    return this.repository.save(user);
  }

  async findById(id: number): Promise<TwofaUser | null> {
    return this.repository.findOne({
      where: { id },
    });
  }
}