export type TwoFactorMethod = "SMS" | "TOTP";

export interface TwoFactorStatus {
  enabled: boolean;
  method?: TwoFactorMethod;
}

export interface VerifyTwoFactorRequest {
  otp: string;
}

export interface VerifyTwoFactorResponse {
  success: boolean;
  message: string;
}

// -----------------------------
// TOTP
// -----------------------------

export interface TotpStatusResponse {
  success: boolean;
  configured: boolean;
  enabled: boolean;
}

export interface TotpSetupResponse {
  success: boolean;
  message: string;
  qrCode: string;
  otpauthUrl: string;
  enabled: boolean;
}

export interface TotpVerifyResponse {
  success: boolean;
  message: string;
  enabled: boolean;
}

export interface TotpDisableResponse {
  success: boolean;
  message: string;
  enabled: boolean;
}

export interface TotpCodeRequest {
  code: string;
}