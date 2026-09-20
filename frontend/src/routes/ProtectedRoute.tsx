import { Navigate, Outlet } from "react-router-dom";

import Spinner from "../components/common/Spinner";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { user, loading, initialized } = useAuth();

  // Ask the backend who the current user is
  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Spinner size="lg" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
