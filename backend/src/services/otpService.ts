import bcrypt from "bcrypt";

import { TwofaOtpRepository } from "../repositories/TwofaOtpRepository.js";
import { generateOtp } from "../utils/otp.js";

export class OtpService {
  private otpRepository = new TwofaOtpRepository();

  async generateAndSaveOtp(
    userId: number,
    purpose: string,
  ) {
    // Generate a secure 6-digit OTP
    const otp = generateOtp();

    // Hash OTP before storing it in the database
    const otpHash = await bcrypt.hash(otp, 10);

    // OTP is valid for 5 minutes
    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000,
    );

    const otpRecord =
      await this.otpRepository.createOtp(
        userId,
        otpHash,
        purpose,
        expiresAt,
      );

    return {
      id: otpRecord.id,

      // Return the plain OTP internally.
      // It will be used by Twilio.
      otp,

      expiresAt: otpRecord.expiresAt,
    };
  }

async verifyOtp(
  userId: number,
  otp: string,
  purpose: string,
): Promise<boolean> {
  const otpRecord =
    await this.otpRepository.findLatestValidOtp(
      userId,
      purpose,
    );

  if (!otpRecord) {
    return false;
  }

  // Maximum 5 incorrect attempts
  if (otpRecord.attempts >= 5) {
    return false;
  }

  const otpMatches = await bcrypt.compare(
    otp,
    otpRecord.otp,
  );

  if (!otpMatches) {
    await this.otpRepository.incrementAttempts(
      otpRecord.id,
    );

    return false;
  }

  await this.otpRepository.markVerified(
    otpRecord.id,
  );

  return true;
}
}