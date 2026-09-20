import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/common/Card";
import Button from "../components/common/Button";

import { useAuth } from "../hooks/useAuth";
import { useTwoFactor } from "../hooks/useTwoFactor";

export default function Dashboard() {
  const navigate = useNavigate();

  const { user, loading, logout } = useAuth();

  const { status: totpStatus, loadStatus: loadTotpStatus } = useTwoFactor();

  useEffect(() => {
    loadTotpStatus();
  }, [loadTotpStatus]);

  const handleLogout = async () => {
    await logout();

    navigate("/login", {
      replace: true,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">Loading your account...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <Card className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Session Not Found
          </h1>

          <p className="mt-3 text-slate-600">Please login to continue.</p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 font-semibold text-blue-600 hover:text-blue-700"
          >
            Go to Login
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}

      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
              2F
            </div>

            <div>
              <h1 className="font-bold text-slate-900">2FA Twilio App</h1>

              <p className="text-xs text-slate-500">Secure Authentication</p>
            </div>
          </div>

          <Button type="button" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main */}

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Welcome */}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Welcome, {user.name}! 👋
          </h2>

          <p className="mt-2 text-slate-600">
            You are successfully authenticated.
          </p>
        </div>

        {/* Status */}

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {/* Authentication */}

          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-600">
                ✓
              </div>

              <div>
                <p className="text-sm text-slate-500">Authentication</p>

                <p className="font-semibold text-green-600">Verified</p>
              </div>
            </div>
          </Card>

          {/* Verification */}

          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                SMS
              </div>

              <div>
                <p className="text-sm text-slate-500">Verification</p>

                <p className="font-semibold text-slate-900">OTP Enabled</p>
              </div>
            </div>
          </Card>

          {/* Session */}

          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                JWT
              </div>

              <div>
                <p className="text-sm text-slate-500">Session</p>

                <p className="font-semibold text-slate-900">Secure Cookie</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Two-Factor Authentication */}

        <Card className="mb-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl">
                  🔐
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Two-Factor Authentication
                  </h3>

                  {totpStatus === null ? (
                    <p className="mt-1 text-sm text-slate-500">
                      Checking authenticator status...
                    </p>
                  ) : totpStatus.enabled ? (
                    <p className="mt-1 text-sm text-green-600">
                      Authenticator App is enabled ✓
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-slate-600">
                      SMS OTP is available. You can add an authenticator app at
                      any time.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={() => navigate("/two-factor")}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                {totpStatus?.enabled
                  ? "Manage Authenticator"
                  : "Set Up Authenticator App"}
              </button>
            </div>
          </div>
        </Card>

        {/* Account information */}

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Account Information
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your authenticated profile
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/two-factor")}
              className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Two-Factor Settings
            </button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Full Name</p>

              <p className="mt-1 font-medium text-slate-900">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Email Address</p>

              <p className="mt-1 font-medium text-slate-900">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Mobile Number</p>

              <p className="mt-1 font-medium text-slate-900">{user.mobile}</p>
            </div>

            {user.createdAt && (
              <div>
                <p className="text-sm text-slate-500">Account Created</p>

                <p className="mt-1 font-medium text-slate-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
