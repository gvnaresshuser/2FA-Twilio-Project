import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

import { verifyTotpLogin } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

interface LocationState {
  userId?: number;
  challengeToken?: string;
  challengeExpiresAt?: string;
}

export default function VerifyTotpLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

  const state = location.state as LocationState | null;

  const challengeToken = state?.challengeToken;
  const challengeExpiresAt = state?.challengeExpiresAt;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!challengeExpiresAt) {
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.ceil((new Date(challengeExpiresAt).getTime() - Date.now()) / 1000),
      );

      setSecondsLeft(remaining);
    };

    updateTimer();

    const timer = window.setInterval(updateTimer, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [challengeExpiresAt]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "");

    if (value.length <= 6) {
      setCode(value);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!challengeToken || !challengeExpiresAt) {
      setError("Verification session is missing. Please login again.");
      return;
    }

    if (secondsLeft !== null && secondsLeft <= 0) {
      setError("Verification session has expired. Please login again.");
      return;
    }

    if (code.length !== 6) {
      setError("Please enter the 6-digit authenticator code.");
      return;
    }

    try {
      setLoading(true);

      await verifyTotpLogin({
        challengeToken,
        code,
      });

      // JWT HttpOnly cookie has now been created by the backend.
      
      await fetchCurrentUser();

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Invalid TOTP code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!challengeToken || !challengeExpiresAt) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <Card className="w-full max-w-md text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl">
            ⚠️
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Verification Session Missing
          </h1>

          <p className="mt-3 text-sm text-gray-600">
            Your login verification session is missing. Please login again.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 font-semibold text-blue-600 hover:text-blue-700"
          >
            Back to Login
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <Card className="w-full border border-white/60 shadow-xl">
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl">
              🔐
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Authenticator Verification
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Open your authenticator app and enter the 6-digit verification
              code.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Input
              id="totp-code"
              name="totp-code"
              type="text"
              inputMode="numeric"
              label="Authenticator Code"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={handleChange}
              autoComplete="one-time-code"
              maxLength={6}
            />

            {secondsLeft !== null && (
              <div
                className={`rounded-lg p-3 text-center text-sm ${
                  secondsLeft <= 30
                    ? "bg-red-50 text-red-600"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                Verification session expires in{" "}
                <span className="font-semibold">
                  {Math.floor(secondsLeft / 60)}:
                  {String(secondsLeft % 60).padStart(2, "0")}
                </span>
              </div>
            )}

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <Button
              type="submit"
              loading={loading}
              disabled={code.length !== 6 || secondsLeft === 0}
            >
              Verify & Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/two-factor-method")}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              ← Back to Verification Methods
            </button>
          </div>

          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <p className="text-center text-xs text-slate-500">
              Your authenticator code changes automatically every few seconds.
              Use the current code shown in your authenticator app.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
