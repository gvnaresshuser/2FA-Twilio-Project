/* export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}; */
import { randomInt } from "node:crypto";

export const generateOtp = (): string => {
  return randomInt(100000, 1000000).toString();
};