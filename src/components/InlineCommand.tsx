"use client";

import { useState } from "react";

export function InlineCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignored
    }
  }

  return (
    <span className="group relative inline-flex items-center gap-2.5 rounded border border-line bg-white px-2.5 py-1.5 font-mono text-[12px] text-ink">
      {command}
      <button
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy command"}
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-line bg-bg text-faint opacity-0 transition-all hover:border-lineStrong hover:text-ink group-hover:opacity-100"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </span>
  );
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="5" width="9" height="9" rx="1.5" />
      <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}
