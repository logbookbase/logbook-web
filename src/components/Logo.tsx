type Variant = "dark" | "light";

export function Logo({
  size = 30,
  variant = "dark",
  className = "",
}: {
  size?: number;
  variant?: Variant;
  className?: string;
}) {
  const pageFill = variant === "dark" ? "#0a0a0a" : "#ffffff";
  const textStroke = variant === "dark" ? "#ffffff" : "#0a0a0a";
  const sealFill = variant === "dark" ? "#2563eb" : "#3b82f6";
  const sealStroke = variant === "dark" ? "#ffffff" : "#0a0a0a";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
    >
      <path d="M3 8 L15 6 L15 27 L3 25 Z" fill={pageFill} />
      <path d="M29 8 L17 6 L17 27 L29 25 Z" fill={pageFill} />
      <path
        d="M6 12h6M6 16h5M19 12h6M19 16h5"
        stroke={textStroke}
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <circle
        cx="16"
        cy="20"
        r="4"
        fill={sealFill}
        stroke={sealStroke}
        strokeWidth="1"
      />
    </svg>
  );
}
