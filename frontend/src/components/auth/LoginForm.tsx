import { useState, type ChangeEvent, type FormEvent } from "react";

import { login } from "../../api/authApi";

import type { LoginResponse } from "../../types/auth";

import Button from "../common/Button";
import Input from "../common/Input";

interface LoginFormProps {
  onSuccess: (response: LoginResponse) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required");

      return;
    }

    try {
      setLoading(true);

      const response = await login(form);

      onSuccess(response);
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        value={form.email}
        onChange={handleChange}
        autoComplete="email"
      />

      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        value={form.password}
        onChange={handleChange}
        autoComplete="current-password"
      />

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <Button type="submit" loading={loading}>
        Login
      </Button>
    </form>
  );
}
