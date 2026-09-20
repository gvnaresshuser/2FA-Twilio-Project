import { useState } from "react";

import QrCodeDisplay from "./QrCodeDisplay";

interface TotpSetupProps {
  qrCode: string;
  otpauthUrl: string;
  onVerify: (code: string) => Promise<unknown>;
  loading: boolean;
  error: string | null;
}

export default function TotpSetup({
  qrCode,
  otpauthUrl,
  onVerify,
  loading,
  error,
}: TotpSetupProps) {
  const [code, setCode] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(code)) {
      return;
    }

    const result = await onVerify(code);

    if (result) {
      setCode("");
    }
  };

  return (
    <div className="space-y-6">
      <QrCodeDisplay
        qrCode={qrCode}
        otpauthUrl={otpauthUrl}
      />

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md space-y-4"
      >
        <div>
          <label
            htmlFor="totp-code"
            className="mb-1 block text-sm font-medium"
          >
            Enter Authenticator Code
          </label>

          <input
            id="totp-code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(event) =>
              setCode(
                event.target.value.replace(/\D/g, ""),
              )
            }
            placeholder="123456"
            className="w-full rounded-md border px-4 py-2 text-center text-lg tracking-widest outline-none focus:ring-2"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Verifying..."
            : "Verify & Enable TOTP"}
        </button>
      </form>
    </div>
  );
}

