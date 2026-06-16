"use client";

import { useState } from "react";

export function InstallBlock() {
  const [copied, setCopied] = useState(false);
  const command = "npm install @logbook/sdk";

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
    <div className="group mx-auto inline-flex w-full max-w-[380px] items-center justify-between rounded-lg border border-lineStrong bg-white px-4 py-3 font-mono text-[13px]">
      <span className="overflow-hidden text-ellipsis whitespace-nowrap text-muted">
        <span className="mr-2.5 text-faint">$</span>
        {command}
      </span>
      <button
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy install command"}
        className="ml-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-line bg-bg text-faint opacity-0 transition-all hover:border-lineStrong hover:text-ink group-hover:opacity-100"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="5" width="9" height="9" rx="1.5" />
      <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}
