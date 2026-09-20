import { useEffect, useState, type FormEvent } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { verifyOtp } from "../api/authApi";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import OtpInput from "../components/auth/OtpInput";

import { useAuth } from "../hooks/useAuth";

interface LocationState {
  userId?: number;
  otpExpiresAt?: string;
}

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const { fetchCurrentUser } = useAuth();

  const state = location.state as LocationState | null;

  const userId = state?.userId;
  const otpExpiresAt = state?.otpExpiresAt;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!otpExpiresAt) {
      return;
    }

    const updateCountdown = () => {
      const expiresAt = new Date(otpExpiresAt).getTime();

      const remaining = Math.max(
        0,
        Math.floor((expiresAt - Date.now()) / 1000),
      );

      setRemainingSeconds(remaining);
    };

    updateCountdown();

    const timer = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [otpExpiresAt]);

  const isExpired = remainingSeconds <= 0;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);

    const remaining = seconds % 60;

    return `${minutes}:${remaining.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!userId) {
      setError("Login session not found. Please login again.");
      return;
    }

    if (isExpired) {
      setError("This OTP has expired. Please login again.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      await verifyOtp({
        userId,
        otp,
      });

      await fetchCurrentUser();

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error: any) {
      setError(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (!userId || !otpExpiresAt) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <Card className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-xl">
            !
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Verification Session Missing
          </h1>

          <p className="mt-3 text-gray-600">
            Please login again to request a new verification code.
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

            <h1 className="text-3xl font-bold text-slate-900">Verify OTP</h1>

            <p className="mt-2 text-sm text-slate-600">
              Enter the 6-digit verification code
            </p>
          </div>

          <div className="mt-8 rounded-lg bg-slate-50 p-4 text-center">
            <p className="text-sm text-slate-600">OTP expires in</p>

            <p
              className={`mt-1 text-2xl font-bold ${
                isExpired ? "text-red-600" : "text-blue-600"
              }`}
            >
              {isExpired ? "Expired" : formatTime(remainingSeconds)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <OtpInput
              value={otp}
              onChange={setOtp}
              disabled={loading || isExpired}
            />

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
                {error}
              </p>
            )}

            <Button type="submit" loading={loading} disabled={isExpired}>
              Verify OTP
            </Button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-500">Didn't receive the code?</p>

            <p className="mt-1 text-xs text-slate-400">
              Login again to request a new OTP.
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Back to Login
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
