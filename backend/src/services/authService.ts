import bcrypt from "bcrypt";

import { AppDataSource } from "../config/database.js";
import { TwofaTotp } from "../entities/TwofaTotp.js";
import { TwofaUserRepository } from "../repositories/TwofaUserRepository.js";
import { OtpService } from "./otpService.js";
import { sendSms } from "./twilioService.js";
import loginChallengeService from "./LoginChallengeService.js";

import { normalizeIndianMobile } from "../utils/mobileUtils.js";

export class AuthService {
  private userRepository = new TwofaUserRepository();

  private otpService = new OtpService();

  private totpRepository =
    AppDataSource.getRepository(TwofaTotp);

  // ----------------------------------
  // REGISTER
  // ----------------------------------

  async register(
    name: string,
    email: string,
    password: string,
    mobile: string,
  ) {
    const existingUser =
      await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Normalize the Indian mobile number
    // before saving it to the database.
    const normalizedMobile =
      normalizeIndianMobile(mobile);

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await this.userRepository.createUser(
        name,
        email,
        hashedPassword,
        normalizedMobile,
      );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      createdAt: user.createdAt,
    };
  }

  // ----------------------------------
  // LOGIN
  // ----------------------------------

  async login(
    email: string,
    password: string,
  ) {
    const user =
      await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error(
        "Invalid email or password",
      );
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (!passwordMatches) {
      throw new Error(
        "Invalid email or password",
      );
    }

    /*
     * Password is correct.
     *
     * Check whether TOTP is enabled
     * for this user.
     */

    const totp =
      await this.totpRepository.findOne({
        where: {
          userId: user.id,
        },
      });

    const totpEnabled =
      totp?.enabled ?? false;

    /*
     * If TOTP is enabled, do not
     * automatically send SMS OTP.
     *
     * The frontend will allow the
     * user to choose TOTP or SMS.
     */

    if (totpEnabled) {
      const challenge =
        await loginChallengeService.createChallenge(
          user.id,
        );

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
        },

        totpEnabled: true,

        challengeToken:
          challenge.challengeToken,

        challengeExpiresAt:
          challenge.expiresAt,
      };
    }

    /*
     * TOTP is not enabled.
     *
     * Preserve the existing SMS OTP flow.
     */

    const otp =
      await this.otpService.generateAndSaveOtp(
        user.id,
        "LOGIN",
      );

    console.log(
      "DEBUG APP OTP:",
      otp.otp,
    );

    /*
     * Development:
     */

    await sendSms(user.mobile);

    /*
     * Production:
     *
     * await sendSms(
     *   user.mobile,
     *   `Your login verification code is ${otp.otp}. It is valid for 5 minutes.`,
     * );
     */

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },

      totpEnabled: false,

      otpExpiresAt:
        otp.expiresAt,
    };
  }

  // ----------------------------------
  // GET CURRENT USER
  // ----------------------------------

  async getCurrentUser(userId: number) {
    const user =
      await this.userRepository.findById(
        userId,
      );

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      createdAt: user.createdAt,
    };
  }
}