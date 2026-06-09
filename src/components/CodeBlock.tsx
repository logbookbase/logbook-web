"use client";

import { useState } from "react";

export function CodeBlock({
  children,
  language = "bash",
  className = "",
}: {
  children: string;
  language?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignored
    }
  }

  return (
    <div className={`group relative my-4 overflow-hidden rounded-lg bg-ink ${className}`}>
      <button
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-white/70 opacity-0 backdrop-blur transition-all hover:border-white/20 hover:bg-white/10 hover:text-white group-hover:opacity-100"
      >
        {copied ? (
          <>
            <CheckIcon /> copied
          </>
        ) : (
          <>
            <CopyIcon /> copy
          </>
        )}
      </button>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.7] text-[#e5e7eb]">
        {children}
      </pre>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="5" width="9" height="9" rx="1.5" />
      <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}
