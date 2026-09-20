import bcrypt from "bcrypt";

import { AppDataSource } from "../config/database.js";
import { TwofaTotp } from "../entities/TwofaTotp.js";
import { TwofaUserRepository } from "../repositories/TwofaUserRepository.js";
import { OtpService } from "./otpService.js";
import { sendSms } from "./twilioService.js";

export class AuthService {
  private userRepository = new TwofaUserRepository();

  private otpService = new OtpService();

  private totpRepository =
    AppDataSource.getRepository(TwofaTotp);


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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.createUser(
      name,
      email,
      hashedPassword,
      mobile,
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      createdAt: user.createdAt,
    };
  }

  async login(email: string, password: string) {
    const user =
      await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordMatches =
      await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new Error("Invalid email or password");
    }

    /*
     * Password is correct.
     * Generate and save LOGIN OTP.
     */
    const otp =
      await this.otpService.generateAndSaveOtp(
        user.id,
        "LOGIN",
      );

      console.log("DEBUG APP OTP:", otp.otp);

    /*
     * Send OTP through Twilio SMS.
     */
    //USE THIS FOR PRODUCTION
   /*  await sendSms(
      user.mobile,
      `Your login verification code is ${otp.otp}. It is valid for 5 minutes.`,
    ); */
    //USE ABOVE CODE IN DEVELOPMENT
    await sendSms(user.mobile);

    /*
     * Do NOT return the OTP.
     */
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
      otpExpiresAt: otp.expiresAt,
    };
  }

  async getCurrentUser(userId: number) {
    const user =
      await this.userRepository.findById(userId);

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