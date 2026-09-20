import api from "./axios";

import type {
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RequestSmsOtpRequest,
  RequestSmsOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  VerifySmsLoginRequest,
  VerifySmsLoginResponse,
  VerifyTotpLoginRequest,
  VerifyTotpLoginResponse,
} from "../types/auth";

import type { User } from "../types/user";

export const register = async (
  data: RegisterRequest,
): Promise<User> => {
  const response = await api.post("/auth/register", data);

  return response.data.user;
};

export const login = async (
  data: LoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post(
    "/auth/login",
    data,
  );

  return response.data;
};

export const verifyOtp = async (
  data: VerifyOtpRequest,
): Promise<VerifyOtpResponse> => {
  const response = await api.post(
    "/auth/verify-otp",
    data,
  );

  return response.data;
};

export const getCurrentUser =
  async (): Promise<CurrentUserResponse> => {
    const response = await api.get("/auth/me");

    return response.data;
  };

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const verifyTotpLogin = async (
  data: VerifyTotpLoginRequest,
): Promise<VerifyTotpLoginResponse> => {
  const response = await api.post(
    "/auth/verify-totp",
    data,
  );

  return response.data;
};

export const requestSmsOtp = async (
  data: RequestSmsOtpRequest,
): Promise<RequestSmsOtpResponse> => {
  const response = await api.post(
    "/auth/request-sms-otp",
    data,
  );

  return response.data;
};

export const verifySmsLogin = async (
  data: VerifySmsLoginRequest,
): Promise<VerifySmsLoginResponse> => {
  const response = await api.post(
    "/auth/verify-sms-login",
    data,
  );

  return response.data;
};