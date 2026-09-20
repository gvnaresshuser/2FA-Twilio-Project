import type { Response } from "express";

import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";

import totpService from "../services/TotpService.js";

class TotpController {
  async setup(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });

        return;
      }

      const result = await totpService.setup(userId);

      res.status(200).json({
        success: true,
        message: "TOTP setup initialized successfully",
        ...result,
      });
    } catch (error) {
      console.error("TOTP setup error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to initialize TOTP setup";

      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  async verify(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });

        return;
      }

      const { code } = req.body;

      // Validate code
      if (!code) {
        res.status(400).json({
          success: false,
          message: "TOTP code is required",
        });

        return;
      }

      if (!/^\d{6}$/.test(code)) {
        res.status(400).json({
          success: false,
          message: "TOTP code must be a 6-digit number",
        });

        return;
      }

      const result = await totpService.verify(
        userId,
        code,
      );

      res.status(200).json({
        success: true,
        message: "TOTP verified and enabled successfully",
        ...result,
      });
    } catch (error) {
      console.error("TOTP verification error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to verify TOTP code";

      res.status(400).json({
        success: false,
        message,
      });
    }
  }
  //-------------------------
  async status(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const result = await totpService.getStatus(userId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("TOTP status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get TOTP status",
    });
  }
}

async disable(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const { code } = req.body;

    // Validate code
    if (!code) {
      res.status(400).json({
        success: false,
        message: "TOTP code is required",
      });

      return;
    }

    if (!/^\d{6}$/.test(code)) {
      res.status(400).json({
        success: false,
        message: "TOTP code must be a 6-digit number",
      });

      return;
    }

    const result = await totpService.disable(
      userId,
      code,
    );

    res.status(200).json({
      success: true,
      message: "TOTP disabled successfully",
      ...result,
    });
  } catch (error) {
    console.error("TOTP disable error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to disable TOTP";

    res.status(400).json({
      success: false,
      message,
    });
  }
}
}

export default new TotpController();