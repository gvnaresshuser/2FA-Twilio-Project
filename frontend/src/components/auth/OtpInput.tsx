import { useRef, type ChangeEvent, type KeyboardEvent } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function OtpInput({
  value,
  onChange,
  disabled = false,
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const digits = value.padEnd(6, "").slice(0, 6).split("");

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const digit = event.target.value.replace(/\D/g, "").slice(-1);

    const currentDigits = value.padEnd(6, "").split("");

    currentDigits[index] = digit;

    const newValue = currentDigits
      .join("")
      .replace(/undefined/g, "")
      .slice(0, 6);

    onChange(newValue);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[index] || ""}
          disabled={disabled}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          className="h-12 w-12 rounded-lg border border-gray-300 text-center text-xl font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
