import type { NextFunction, Request, Response } from "express";

import { verifyToken } from "../utils/jwt.js";

export interface AuthenticatedRequest
  extends Request {
  userId?: number;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const payload = verifyToken(token);

    req.userId = payload.userId;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};