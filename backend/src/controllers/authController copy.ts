import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";

import { AuthService } from "../services/authService.js";
import { OtpService } from "../services/otpService.js";
import { generateToken } from "../utils/jwt.js";

const authService = new AuthService();
const otpService = new OtpService();

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
  message: "OTP sent successfully",
  user: result.user,
  otpExpiresAt: result.otpExpiresAt,
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