import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

import { requestSmsOtp, verifySmsLogin } from "../api/authApi";

import { useAuthStore } from "../store/authStore";

interface LocationState {
  userId?: number;
  challengeToken?: string;
  challengeExpiresAt?: string;
}

export default function VerifySmsLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

  const state = location.state as LocationState | null;

  const userId = state?.userId;
  const challengeToken = state?.challengeToken;
  const challengeExpiresAt = state?.challengeExpiresAt;

  const [otp, setOtp] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [requesting, setRequesting] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const [smsSent, setSmsSent] = useState(false);

  /*
   * The login challenge itself expires after 2 minutes.
   */
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

  const handleOtpChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "");

    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleRequestSms = async () => {
    setError("");
    setMessage("");

    if (!challengeToken) {
      setError("Verification session is missing. Please login again.");
      return;
    }

    if (secondsLeft !== null && secondsLeft <= 0) {
      setError("Verification session has expired. Please login again.");
      return;
    }

    try {
      setRequesting(true);

      const response = await requestSmsOtp({
        challengeToken,
      });

      setOtpExpiresAt(response.otpExpiresAt);
      setSmsSent(true);

      setMessage("SMS verification code sent successfully.");
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to send SMS OTP.");
    } finally {
      setRequesting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!challengeToken) {
      setError("Verification session is missing. Please login again.");
      return;
    }

    if (secondsLeft !== null && secondsLeft <= 0) {
      setError("Verification session has expired. Please login again.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter the 6-digit SMS OTP.");
      return;
    }

    try {
      setVerifying(true);

      await verifySmsLogin({
        challengeToken,
        otp,
      });

      /*
       * JWT HttpOnly cookie has now been
       * created by the backend.
       */
      await fetchCurrentUser();

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Invalid SMS OTP. Please try again.",
      );
    } finally {
      setVerifying(false);
    }
  };

  if (!userId || !challengeToken || !challengeExpiresAt) {
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
              📱
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              SMS Verification
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Receive a one-time password through SMS and enter it below.
            </p>
          </div>

          {!smsSent && (
            <div className="mt-8">
              <Button
                type="button"
                loading={requesting}
                onClick={handleRequestSms}
              >
                Send SMS Code
              </Button>
            </div>
          )}

          {smsSent && (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {otpExpiresAt && (
                <div className="rounded-lg bg-blue-50 p-3 text-center text-sm text-blue-700">
                  SMS code sent. Please enter the code before it expires.
                </div>
              )}

              <Input
                id="sms-otp"
                name="sms-otp"
                type="text"
                inputMode="numeric"
                label="SMS OTP"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={handleOtpChange}
                autoComplete="one-time-code"
                maxLength={6}
              />

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {message && (
                <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  {message}
                </p>
              )}

              <Button
                type="submit"
                loading={verifying}
                disabled={otp.length !== 6 || secondsLeft === 0}
              >
                Verify & Login
              </Button>

              <button
                type="button"
                onClick={handleRequestSms}
                disabled={requesting || secondsLeft === 0}
                className="w-full text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-400"
              >
                {requesting ? "Sending..." : "Resend SMS Code"}
              </button>
            </form>
          )}

          {secondsLeft !== null && (
            <div
              className={`mt-5 rounded-lg p-3 text-center text-sm ${
                secondsLeft <= 30
                  ? "bg-red-50 text-red-600"
                  : "bg-slate-50 text-slate-600"
              }`}
            >
              Login session expires in{" "}
              <span className="font-semibold">
                {Math.floor(secondsLeft / 60)}:
                {String(secondsLeft % 60).padStart(2, "0")}
              </span>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() =>
                navigate("/two-factor-method", {
                  state: {
                    userId,
                    challengeToken,
                    challengeExpiresAt,
                  },
                })
              }
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              ← Back to Verification Methods
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
