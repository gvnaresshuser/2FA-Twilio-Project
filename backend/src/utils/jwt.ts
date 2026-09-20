import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export interface JwtPayload {
  userId: number;
}

export const generateToken = (userId: number): string => {
  return jwt.sign(
    {
      userId,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    } as jwt.SignOptions,
  );
};

export const verifyToken = (
  token: string,
): JwtPayload => {
  return jwt.verify(
    token,
    env.jwtSecret,
  ) as JwtPayload;
};