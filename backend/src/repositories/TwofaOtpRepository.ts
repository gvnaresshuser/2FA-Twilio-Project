import { MoreThan } from "typeorm";

import { AppDataSource } from "../config/database.js";
import { TwofaOtpCode } from "../entities/TwofaOtpCode.js";

export class TwofaOtpRepository {
  private repository =
    AppDataSource.getRepository(TwofaOtpCode);

  async createOtp(
    userId: number,
    otp: string,
    purpose: string,
    expiresAt: Date,
  ): Promise<TwofaOtpCode> {
    const otpRecord = this.repository.create({
      userId,
      otp,
      purpose,
      expiresAt,
      verified: false,
      attempts: 0,
    });

    return this.repository.save(otpRecord);
  }

  async findLatestValidOtp(
    userId: number,
    purpose: string,
  ): Promise<TwofaOtpCode | null> {
    return this.repository.findOne({
      where: {
        userId,
        purpose,
        verified: false,
        expiresAt: MoreThan(new Date()),
      },
      order: {
        createdAt: "DESC",
      },
    });
  }

  async incrementAttempts(id: number): Promise<void> {
    await this.repository.increment(
      { id },
      "attempts",
      1,
    );
  }

  async markVerified(id: number): Promise<void> {
    await this.repository.update(
      { id },
      {
        verified: true,
      },
    );
  }

  async deleteExpiredOtps(): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(TwofaOtpCode)
      .where("expires_at < NOW()")
      .execute();
  }
}