import { Router } from "express";

import TotpController from "../controllers/TotpController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post(
  "/setup",
  authenticate,
  TotpController.setup,
);

router.post(
  "/verify",
  authenticate,
  TotpController.verify,
);

router.get(
  "/status",
  authenticate,
  TotpController.status,
);

router.post(
  "/disable",
  authenticate,
  TotpController.disable,
);

export default router;