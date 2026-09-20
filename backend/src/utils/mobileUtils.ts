export const normalizeIndianMobile = (
  mobile: string,
): string => {
  const value = mobile.trim();

  // Remove spaces, hyphens, brackets, etc.
  const digits = value.replace(/\D/g, "");

  // 10-digit Indian mobile number
  // Example: 9949570732
  if (/^[6-9]\d{9}$/.test(digits)) {
    return `+91${digits}`;
  }

  // 12-digit number beginning with 91
  // Example: 919949570732
  if (/^91[6-9]\d{9}$/.test(digits)) {
    return `+${digits}`;
  }

  throw new Error(
    "Please enter a valid 10-digit Indian mobile number",
  );
};