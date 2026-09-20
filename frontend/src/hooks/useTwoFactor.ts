import { useCallback, useState } from "react";

import {
  disableTotp,
  getTotpStatus,
  setupTotp,
  verifyTotp,
} from "../api/twofaApi";

import type {
  TotpSetupResponse,
  TotpStatusResponse,
} from "../types/twofa";

export const useTwoFactor = () => {
  const [status, setStatus] =
    useState<TotpStatusResponse | null>(null);

  const [setupData, setSetupData] =
    useState<TotpSetupResponse | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // ----------------------------------
  // GET TOTP STATUS
  // ----------------------------------

  const loadStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getTotpStatus();

      setStatus(result);

      return result;
    } catch (err) {
      console.error(
        "Failed to load TOTP status:",
        err,
      );

      setError("Failed to load TOTP status");

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------------
  // SETUP TOTP
  // ----------------------------------

  const setup = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await setupTotp();

      // Store the newly generated QR code
      // and TOTP setup information temporarily.
      setSetupData(result);

      return result;
    } catch (err) {
      console.error(
        "Failed to setup TOTP:",
        err,
      );

      setError(
        "Failed to initialize TOTP setup",
      );

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------------
  // VERIFY TOTP
  // ----------------------------------

  const verify = useCallback(
    async (code: string) => {
      try {
        setLoading(true);
        setError(null);

        const result = await verifyTotp({
          code,
        });

        if (result.success) {
          setStatus({
            success: true,
            configured: true,
            enabled: true,
          });

          // TOTP setup is now complete.
          // Remove the temporary QR code/setup data.
          setSetupData(null);
        }

        return result;
      } catch (err) {
        console.error(
          "Failed to verify TOTP:",
          err,
        );

        setError(
          "Invalid or failed TOTP verification",
        );

        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ----------------------------------
  // DISABLE TOTP
  // ----------------------------------

  const disable = useCallback(
    async (code: string) => {
      try {
        setLoading(true);
        setError(null);

        const result = await disableTotp({
          code,
        });

        if (result.success) {
          setStatus({
            success: true,
            configured: true,
            enabled: false,
          });

          // Do not keep the previous QR code/setup data.
          // A fresh QR code will be generated if
          // the user enables TOTP again.
          setSetupData(null);
        }

        return result;
      } catch (err) {
        console.error(
          "Failed to disable TOTP:",
          err,
        );

        setError(
          "Invalid or failed TOTP disable request",
        );

        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ----------------------------------
  // RETURN
  // ----------------------------------

  return {
    status,
    setupData,
    loading,
    error,

    loadStatus,
    setup,
    verify,
    disable,
  };
};