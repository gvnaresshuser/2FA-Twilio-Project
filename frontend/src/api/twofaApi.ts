import api from "./axios";

import type {
  TotpCodeRequest,
  TotpDisableResponse,
  TotpSetupResponse,
  TotpStatusResponse,
  TotpVerifyResponse,
} from "../types/twofa";

// ----------------------------------
// TOTP STATUS
// ----------------------------------

export const getTotpStatus =
  async (): Promise<TotpStatusResponse> => {
    const response = await api.get<TotpStatusResponse>(
      "/twofa/totp/status",
    );

    return response.data;
  };

// ----------------------------------
// TOTP SETUP
// ----------------------------------

export const setupTotp =
  async (): Promise<TotpSetupResponse> => {
    const response = await api.post<TotpSetupResponse>(
      "/twofa/totp/setup",
    );

    return response.data;
  };

// ----------------------------------
// TOTP VERIFY
// ----------------------------------

export const verifyTotp = async (
  data: TotpCodeRequest,
): Promise<TotpVerifyResponse> => {
  const response = await api.post<TotpVerifyResponse>(
    "/twofa/totp/verify",
    data,
  );

  return response.data;
};

// ----------------------------------
// TOTP DISABLE
// ----------------------------------

export const disableTotp = async (
  data: TotpCodeRequest,
): Promise<TotpDisableResponse> => {
  const response = await api.post<TotpDisableResponse>(
    "/twofa/totp/disable",
    data,
  );

  return response.data;
};

