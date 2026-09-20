import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, id, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        id={id}
        {...props}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
