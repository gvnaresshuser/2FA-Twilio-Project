import type { User } from "./user";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  mobile: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  totpEnabled: boolean;
  otpExpiresAt?: string;
  challengeToken?: string;
  challengeExpiresAt?: string;
}

export interface VerifyOtpRequest {
  userId: number;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

export interface CurrentUserResponse {
  success: boolean;
  user: User;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
}

export interface VerifyTotpLoginRequest {
  challengeToken: string;
  code: string;
}

export interface VerifyTotpLoginResponse {
  success: boolean;
  message: string;
}

/* SMS Login */

export interface RequestSmsOtpRequest {
  challengeToken: string;
}

export interface RequestSmsOtpResponse {
  success: boolean;
  message: string;
  otpExpiresAt: string;
}

export interface VerifySmsLoginRequest {
  challengeToken: string;
  otp: string;
}

export interface VerifySmsLoginResponse {
  success: boolean;
  message: string;
}