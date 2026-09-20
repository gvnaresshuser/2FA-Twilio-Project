import { useState, type ChangeEvent, type FormEvent } from "react";

import { register } from "../../api/authApi";

import Button from "../common/Button";
import Input from "../common/Input";

interface RegisterFormProps {
  onSuccess: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // ----------------------------------
  // HANDLE INPUT CHANGE
  // ----------------------------------

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ----------------------------------
  // SUBMIT
  // ----------------------------------

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    // ------------------------------
    // REQUIRED FIELDS
    // ------------------------------

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.mobile.trim()
    ) {
      setError("All fields are required");

      return;
    }

    // ------------------------------
    // PASSWORD VALIDATION
    // ------------------------------

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");

      return;
    }

    // ------------------------------
    // EMAIL VALIDATION
    // ------------------------------

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Please enter a valid email address");

      return;
    }

    // ------------------------------
    // MOBILE VALIDATION
    // ------------------------------

    const mobileDigits = form.mobile.replace(/\D/g, "");

    const validIndianMobile =
      /^[6-9]\d{9}$/.test(mobileDigits) || /^91[6-9]\d{9}$/.test(mobileDigits);

    if (!validIndianMobile) {
      setError("Please enter a valid 10-digit Indian mobile number");

      return;
    }

    // ------------------------------
    // REGISTER
    // ------------------------------

    try {
      setLoading(true);

      await register({
        name: form.name.trim(),

        email: form.email.trim(),

        password: form.password,

        /*
         * Backend will normalize this
         * to +91XXXXXXXXXX.
         */
        mobile: form.mobile.trim(),
      });

      onSuccess();
    } catch (error: any) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // UI
  // ----------------------------------

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        name="name"
        type="text"
        label="Full Name"
        placeholder="Enter your name"
        value={form.name}
        onChange={handleChange}
      />

      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        value={form.email}
        onChange={handleChange}
      />

      <Input
        id="mobile"
        name="mobile"
        type="tel"
        label="Mobile Number"
        placeholder="9949570732"
        value={form.mobile}
        onChange={handleChange}
      />

      <p className="-mt-2 text-xs text-gray-500">
        Enter your 10-digit Indian mobile number. +91 will be added
        automatically.
      </p>

      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        value={form.password}
        onChange={handleChange}
      />

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <Button type="submit" loading={loading}>
        Create Account
      </Button>
    </form>
  );
}
