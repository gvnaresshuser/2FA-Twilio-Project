import { useLocation, useNavigate } from "react-router-dom";

import Card from "../components/common/Card";

interface LocationState {
  userId?: number;
  challengeToken?: string;
  challengeExpiresAt?: string;
}

export default function TwoFactorMethod() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;

  const userId = state?.userId;
  const challengeToken = state?.challengeToken;
  const challengeExpiresAt = state?.challengeExpiresAt;

  const handleTotp = () => {
    if (!userId || !challengeToken || !challengeExpiresAt) {
      return;
    }

    navigate("/verify-totp-login", {
      state: {
        userId,
        challengeToken,
        challengeExpiresAt,
      },
    });
  };

  const handleSms = () => {
    if (!userId || !challengeToken || !challengeExpiresAt) {
      return;
    }

    navigate("/verify-sms-login", {
      state: {
        userId,
        challengeToken,
        challengeExpiresAt,
      },
    });
  };

  if (!userId || !challengeToken || !challengeExpiresAt) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <Card className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Verification Session Missing
          </h1>

          <p className="mt-3 text-sm text-gray-600">Please login again.</p>

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
              Choose Verification
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Your password was verified. Choose how you want to complete
              two-factor authentication.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {/* Authenticator App */}
            <button
              type="button"
              onClick={handleTotp}
              className="w-full rounded-xl border border-blue-200 bg-blue-50 p-5 text-left transition hover:border-blue-400 hover:bg-blue-100"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">🔐</div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Authenticator App
                  </h2>

                  <p className="mt-1 text-sm text-slate-600">
                    Use the 6-digit code from Google Authenticator or another
                    compatible app.
                  </p>
                </div>
              </div>
            </button>

            {/* SMS OTP */}
            <button
              type="button"
              onClick={handleSms}
              className="w-full rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-blue-300 hover:bg-slate-50"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">📱</div>

                <div>
                  <h2 className="font-semibold text-slate-900">SMS OTP</h2>

                  <p className="mt-1 text-sm text-slate-600">
                    Receive a verification code through SMS.
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Back to Login
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
