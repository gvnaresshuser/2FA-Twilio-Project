import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyOtp from "../pages/VerifyOtp";
import Dashboard from "../pages/Dashboard";
import TwoFactor from "../pages/TwoFactor";

import ProtectedRoute from "./ProtectedRoute";
import VerifyTotpLogin from "../pages/VerifyTotpLogin";
import TwoFactorMethod from "../pages/TwoFactorMethod";
import VerifySmsLogin from "../pages/VerifySmsLogin";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/two-factor-method" element={<TwoFactorMethod />} />

        <Route path="/verify-totp-login" element={<VerifyTotpLogin />} />
        <Route path="/verify-sms-login" element={<VerifySmsLogin />} />

        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/two-factor" element={<TwoFactor />} />
        </Route>

        {/* Unknown Route */}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
