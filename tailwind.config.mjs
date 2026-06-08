/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f8f9fb",
        ink: "#0a0a0a",
        muted: "#4b5563",
        faint: "#9ca3af",
        line: "#e5e7eb",
        lineStrong: "#d1d5db",
        accent: "#2563eb",
        accentHover: "#1d4ed8",
        accentFaint: "#eff6ff",
        ok: "#16a34a",
        okFaint: "#f0fdf4",
        err: "#dc2626",
        errFaint: "#fef2f2",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.04)",
        receipt: "0 24px 64px rgba(37, 99, 235, 0.15)",
      },
    },
  },
  plugins: [],
};
