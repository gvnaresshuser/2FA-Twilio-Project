interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

export default function Spinner({ size = "md" }: SpinnerProps) {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  }[size];

  return (
    <div
      className={`${sizeClass} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}
      aria-label="Loading"
    />
  );
}
