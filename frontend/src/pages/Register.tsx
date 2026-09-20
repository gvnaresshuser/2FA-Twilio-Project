import { useNavigate } from "react-router-dom";

import Card from "../components/common/Card";
import RegisterForm from "../components/auth/RegisterForm";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <div className="w-full">
          {/* Logo / Brand */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-lg">
              2F
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Create your secure 2FA account
            </p>
          </div>

          <Card className="border border-white/60 shadow-xl">
            <RegisterForm onSuccess={() => navigate("/login")} />

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs text-slate-400">
                ALREADY REGISTERED?
              </span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Login
              </button>
            </p>
          </Card>

          <p className="mt-6 text-center text-xs text-slate-500">
            Your password will be securely hashed before being stored.
          </p>
        </div>
      </div>
    </div>
  );
}
