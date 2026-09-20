import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import totpRoutes from "./routes/totpRoutes.js";

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "2FA Backend API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/twofa/totp", totpRoutes);

export default app;