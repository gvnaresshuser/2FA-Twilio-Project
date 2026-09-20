import crypto from "crypto";

import { AppDataSource } from "../config/database.js";
import { TwofaLoginChallenge } from "../entities/TwofaLoginChallenge.js";

class LoginChallengeService {
  private repository =
    AppDataSource.getRepository(TwofaLoginChallenge);

  async createChallenge(userId: number) {
    const challengeToken =
      crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(
      Date.now() + 2 * 60 * 1000,
    );

    const challenge = this.repository.create({
      userId,
      challengeToken,
      expiresAt,
      used: false,
    });

    await this.repository.save(challenge);

    return {
      challengeToken,
      expiresAt,
    };
  }

  async getValidChallenge(
    challengeToken: string,
  ) {
    const challenge =
      await this.repository.findOne({
        where: {
          challengeToken,
          used: false,
        },
      });

    if (!challenge) {
      throw new Error(
        "Invalid or expired login challenge",
      );
    }

    if (
      challenge.expiresAt.getTime() <=
      Date.now()
    ) {
      throw new Error(
        "Invalid or expired login challenge",
      );
    }

    return challenge;
  }

  async markAsUsed(
    challenge: TwofaLoginChallenge,
  ) {
    challenge.used = true;

    await this.repository.save(challenge);
  }

  async verifyAndConsume(
    challengeToken: string,
  ) {
    const challenge =
      await this.getValidChallenge(
        challengeToken,
      );

    await this.markAsUsed(challenge);

    return challenge;
  }
}

export default new LoginChallengeService();