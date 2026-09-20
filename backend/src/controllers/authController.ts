import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";

import { AuthService } from "../services/authService.js";
import { OtpService } from "../services/otpService.js";
import { generateToken } from "../utils/jwt.js";

import speakeasy from "speakeasy";

import { AppDataSource } from "../config/database.js";
import { TwofaTotp } from "../entities/TwofaTotp.js";
import loginChallengeService from "../services/LoginChallengeService.js";
import { TwofaUser } from "../entities/TwofaUser.js";
import { sendSms } from "../services/twilioService.js";

const authService = new AuthService();
const otpService = new OtpService();
const totpRepository =
  AppDataSource.getRepository(TwofaTotp);
const userRepository =
  AppDataSource.getRepository(TwofaUser);

export const register = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password || !mobile) {
      res.status(400).json({
        success: false,
        message: "Name, email, password and mobile are required",
      });

      return;
    }

    const user = await authService.register(
      name,
      email,
      password,
      mobile,
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";

    if (message === "Email already registered") {
      res.status(409).json({
        success: false,
        message,
      });

      return;
    }

    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });

      return;
    }

    const result = await authService.login(
      email,
      password,
    );

 /*    res.status(200).json({
      success: true,
      message:
        "Password verified. OTP generated successfully.",
      user: result.user,

      // DEVELOPMENT ONLY
      otp: result.otp,
      otpExpiresAt: result.otpExpiresAt,
    }); */
res.status(200).json({
  success: true,

  message: result.totpEnabled
    ? "Password verified. Please choose a verification method."
    : "OTP sent successfully",

  user: result.user,

  totpEnabled: result.totpEnabled,

  ...(result.otpExpiresAt && {
    otpExpiresAt: result.otpExpiresAt,
  }),

  ...(result.challengeToken && {
    challengeToken: result.challengeToken,
  }),

  ...(result.challengeExpiresAt && {
    challengeExpiresAt:
      result.challengeExpiresAt,
  }),
});
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Login failed";

    if (message === "Invalid email or password") {
      res.status(401).json({
        success: false,
        message,
      });

      return;
    }

    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      res.status(400).json({
        success: false,
        message: "User ID and OTP are required",
      });

      return;
    }

    const isValid = await otpService.verifyOtp(
      Number(userId),
      String(otp),
      "LOGIN",
    );

    if (!isValid) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired OTP",
      });

      return;
    }

    // OTP is valid.
    // Generate JWT.
    const token = generateToken(Number(userId));

    // Store JWT in HttpOnly cookie.
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. Login complete.",
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyTotpLogin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      challengeToken,
      code,
    } = req.body;

    if (!challengeToken || !code) {
      res.status(400).json({
        success: false,
        message:
          "Challenge token and TOTP code are required",
      });

      return;
    }

    if (!/^\d{6}$/.test(String(code))) {
      res.status(400).json({
        success: false,
        message:
          "TOTP code must be a 6-digit number",
      });

      return;
    }

    /*
     * Validate the temporary login challenge.
     */
    const challenge =
      await loginChallengeService.getValidChallenge(
        String(challengeToken),
      );

    /*
     * Find the user's TOTP configuration.
     */
    const totp =
      await totpRepository.findOne({
        where: {
          userId: challenge.userId,
          enabled: true,
        },
      });

    if (!totp) {
      res.status(400).json({
        success: false,
        message:
          "TOTP is not enabled for this user",
      });

      return;
    }

    /*
     * Verify the authenticator code.
     */
    const verified =
      speakeasy.totp.verify({
        secret: totp.secret,
        encoding: "base32",
        token: String(code),
        window: 1,
      });

    if (!verified) {
      res.status(401).json({
        success: false,
        message: "Invalid TOTP code",
      });

      return;
    }

    /*
     * TOTP is valid.
     *
     * Consume the challenge so it cannot
     * be reused.
     */
    await loginChallengeService.markAsUsed(
      challenge,
    );

    /*
     * Generate the normal JWT.
     */
    const token = generateToken(
      challenge.userId,
    );

    /*
     * Store JWT in HttpOnly cookie.
     */
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message:
        "TOTP verified successfully. Login complete.",
    });
  } catch (error) {
    console.error(
      "TOTP login verification error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "TOTP verification failed";

    res.status(401).json({
      success: false,
      message,
    });
  }
};

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const user = await authService.getCurrentUser(
      req.userId,
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const requestSmsOtp = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { challengeToken } = req.body;

    if (!challengeToken) {
      res.status(400).json({
        success: false,
        message: "Challenge token is required",
      });
      return;
    }

    const challenge =
      await loginChallengeService.getValidChallenge(
        String(challengeToken),
      );

    const user = await userRepository.findOne({
      where: {
        id: challenge.userId,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const otp =
      await otpService.generateAndSaveOtp(
        user.id,
        "LOGIN",
      );

    console.log(
      "DEBUG APP SMS OTP:",
      otp.otp,
    );

    await sendSms(user.mobile);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otpExpiresAt: otp.expiresAt,
    });
  } catch (error) {
    console.error(
      "Request SMS OTP error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to send SMS OTP";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const verifySmsLogin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      challengeToken,
      otp,
    } = req.body;

    if (!challengeToken || !otp) {
      res.status(400).json({
        success: false,
        message:
          "Challenge token and OTP are required",
      });
      return;
    }

    if (!/^\d{6}$/.test(String(otp))) {
      res.status(400).json({
        success: false,
        message:
          "OTP must be a 6-digit number",
      });
      return;
    }

    const challenge =
      await loginChallengeService.getValidChallenge(
        String(challengeToken),
      );

    await otpService.verifyOtp(
      challenge.userId,
      String(otp),
      "LOGIN",
    );

    await loginChallengeService.markAsUsed(
      challenge,
    );

    const token = generateToken(
      challenge.userId,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message:
        "SMS OTP verified successfully. Login complete.",
    });
  } catch (error) {
    console.error(
      "SMS login verification error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "SMS OTP verification failed";

    res.status(401).json({
      success: false,
      message,
    });
  }
};