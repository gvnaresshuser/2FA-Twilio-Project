import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TotpSetup from "../components/twofa/TotpSetup";
import { useTwoFactor } from "../hooks/useTwoFactor";

export default function TwoFactor() {
  const navigate = useNavigate();

  const {
    status,
    setupData,
    loading,
    error,
    loadStatus,
    setup,
    verify,
    disable,
  } = useTwoFactor();

  const [disableCode, setDisableCode] = useState("");

  const [disableError, setDisableError] = useState<string | null>(null);

  const [disableSuccess, setDisableSuccess] = useState<string | null>(null);

  // ----------------------------------
  // LOAD TOTP STATUS
  // ----------------------------------

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // ----------------------------------
  // ENABLE / SETUP TOTP
  // ----------------------------------

  const handleSetup = async () => {
    setDisableError(null);
    setDisableSuccess(null);

    await setup();
  };

  // ----------------------------------
  // DISABLE TOTP
  // ----------------------------------

  const handleDisable = async () => {
    setDisableError(null);
    setDisableSuccess(null);

    if (!/^\d{6}$/.test(disableCode)) {
      setDisableError("Please enter a valid 6-digit authenticator code.");

      return;
    }

    const result = await disable(disableCode);

    if (result?.success) {
      setDisableCode("");

      setDisableSuccess("TOTP has been disabled successfully.");
    }
  };

  // ----------------------------------
  // LOADING
  // ----------------------------------

  if (loading && !status && !setupData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading Two-Factor settings...</p>
      </div>
    );
  }

  // ----------------------------------
  // PAGE
  // ----------------------------------

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl bg-white p-6 shadow-md">
          {/* -------------------------------- */}
          {/* BACK TO DASHBOARD */}
          {/* -------------------------------- */}

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            <span>←</span>
            Back to Dashboard
          </button>

          {/* -------------------------------- */}
          {/* PAGE TITLE */}
          {/* -------------------------------- */}

          <h1 className="mb-2 text-2xl font-bold">Two-Factor Authentication</h1>

          <p className="mb-8 text-sm text-gray-600">
            Manage your authenticator-based two-factor authentication.
          </p>

          {/* -------------------------------- */}
          {/* TOTP STATUS */}
          {/* -------------------------------- */}

          <div className="mb-8 rounded-lg border p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold">Authenticator App</h2>

                <p className="text-sm text-gray-600">
                  Use Google Authenticator or another compatible TOTP
                  application.
                </p>
              </div>

              <span
                className={
                  status?.enabled
                    ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                    : "rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600"
                }
              >
                {status?.enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>

          {/* -------------------------------- */}
          {/* FIRST-TIME SETUP */}
          {/* -------------------------------- */}

          {!status?.configured && !status?.enabled && !setupData && (
            <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-5">
              <h2 className="mb-2 text-lg font-semibold text-blue-900">
                Set Up Authenticator App
              </h2>

              <p className="mb-4 text-sm text-blue-800">
                Add an authenticator app to provide an additional layer of
                security when signing in.
              </p>

              <button
                type="button"
                onClick={handleSetup}
                disabled={loading}
                className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Generating QR Code..." : "Set Up Authenticator App"}
              </button>
            </div>
          )}

          {/* -------------------------------- */}
          {/* RE-ENABLE AFTER DISABLE */}
          {/* -------------------------------- */}

          {status?.configured && !status?.enabled && !setupData && (
            <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-5">
              <h2 className="mb-2 text-lg font-semibold text-blue-900">
                Enable Authenticator App
              </h2>

              <p className="mb-4 text-sm text-blue-800">
                Authenticator-based two-factor authentication is currently
                disabled. You can enable it again by scanning a new QR code.
              </p>

              <button
                type="button"
                onClick={handleSetup}
                disabled={loading}
                className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Generating QR Code..." : "Enable Authenticator App"}
              </button>
            </div>
          )}

          {/* -------------------------------- */}
          {/* TOTP QR SETUP */}
          {/* -------------------------------- */}

          {!status?.enabled && setupData && (
            <div className="mb-8">
              <TotpSetup
                qrCode={setupData.qrCode}
                otpauthUrl={setupData.otpauthUrl}
                onVerify={verify}
                loading={loading}
                error={error}
              />
            </div>
          )}

          {/* -------------------------------- */}
          {/* DISABLE TOTP */}
          {/* -------------------------------- */}

          {status?.enabled && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-5">
              <h2 className="mb-2 text-lg font-semibold text-red-800">
                Disable Authenticator App
              </h2>

              <p className="mb-4 text-sm text-red-700">
                Enter the current code from your authenticator app to disable
                TOTP.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={disableCode}
                  onChange={(event) =>
                    setDisableCode(event.target.value.replace(/\D/g, ""))
                  }
                  placeholder="123456"
                  className="rounded-md border border-red-300 bg-white px-4 py-2 text-center tracking-widest outline-none focus:ring-2"
                />

                <button
                  type="button"
                  onClick={handleDisable}
                  disabled={loading || disableCode.length !== 6}
                  className="rounded-md bg-red-600 px-5 py-2 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Disabling..." : "Disable TOTP"}
                </button>
              </div>

              {disableError && (
                <p className="mt-3 text-sm text-red-700">{disableError}</p>
              )}

              {disableSuccess && (
                <p className="mt-3 text-sm text-green-700">{disableSuccess}</p>
              )}
            </div>
          )}

          {/* -------------------------------- */}
          {/* GENERAL ERROR */}
          {/* -------------------------------- */}

          {error && !setupData && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
