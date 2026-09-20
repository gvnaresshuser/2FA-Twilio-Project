import { useNavigate } from "react-router-dom";

import Card from "../components/common/Card";
import LoginForm from "../components/auth/LoginForm";
import type { LoginResponse } from "../types/auth";
export default function Login() {
  const navigate = useNavigate();

const handleLoginSuccess = (response: LoginResponse) => {
  if (
    response.totpEnabled &&
    response.challengeToken &&
    response.challengeExpiresAt
  ) {
    navigate("/two-factor-method", {
      state: {
        userId: response.user.id,
        challengeToken: response.challengeToken,
        challengeExpiresAt: response.challengeExpiresAt,
      },
    });

    return;
  }

  if (response.otpExpiresAt) {
    navigate("/verify-otp", {
      state: {
        userId: response.user.id,
        otpExpiresAt: response.otpExpiresAt,
      },
    });
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <div className="w-full">
          {/* Logo / Brand */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-lg">
              2F
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Secure Login
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Sign in to your 2FA Twilio application
            </p>
          </div>

          <Card className="border border-white/60 shadow-xl">
            <LoginForm onSuccess={handleLoginSuccess} />

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">OR</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <p className="text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create Account
              </button>
            </p>
          </Card>

          <p className="mt-6 text-center text-xs text-slate-500">
            Your authentication is protected with password verification, OTP and
            JWT HttpOnly cookies.
          </p>
        </div>
      </div>
    </div>
  );
}
