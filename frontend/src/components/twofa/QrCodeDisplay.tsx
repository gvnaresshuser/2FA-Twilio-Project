interface QrCodeDisplayProps {
  qrCode: string;
  otpauthUrl?: string;
}

export default function QrCodeDisplay({
  qrCode,
  otpauthUrl,
}: QrCodeDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold">Scan QR Code</h3>

      <p className="text-center text-sm text-gray-600">
        Open Google Authenticator or another compatible authenticator app and
        scan this QR code.
      </p>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <img src={qrCode} alt="TOTP QR Code" className="h-64 w-64" />
      </div>

      {otpauthUrl && (
        <details className="w-full max-w-md">
          <summary className="cursor-pointer text-sm font-medium">
            Show setup URI
          </summary>

          <p className="mt-2 break-all rounded-md bg-gray-100 p-3 text-xs text-gray-600">
            {otpauthUrl}
          </p>
        </details>
      )}
    </div>
  );
}
