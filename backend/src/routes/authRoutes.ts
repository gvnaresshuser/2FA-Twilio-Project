import { Router } from "express";

import {
  getCurrentUser,
  login,
  logout,
  register,
  verifyOtp,
  verifyTotpLogin,
  requestSmsOtp,
verifySmsLogin,
} from "../controllers/authController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/verify-otp", verifyOtp);

router.post(
  "/verify-totp",
  verifyTotpLogin,
);

router.post(
  "/request-sms-otp",
  requestSmsOtp,
);

router.post(
  "/verify-sms-login",
  verifySmsLogin,
);

router.get("/me", authenticate, getCurrentUser);

router.post("/logout", logout);

export default router;