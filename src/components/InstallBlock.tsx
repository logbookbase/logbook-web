"use client";

export function InstallBlock() {
  return (
    <div className="mx-auto inline-flex w-full max-w-[380px] items-center justify-between rounded-lg border border-lineStrong bg-white px-4 py-3 font-mono text-[13px]">
      <span className="overflow-hidden text-ellipsis whitespace-nowrap text-muted">
        <span className="mr-2.5 text-faint">$</span>
        npm install @logbook/sdk
      </span>
      <button
        onClick={() => {
          navigator.clipboard.writeText("npm install @logbook/sdk");
        }}
        className="ml-3 flex-shrink-0 text-faint transition-colors hover:text-ink"
        aria-label="Copy install command"
      >
        ⎘
      </button>
    </div>
  );
}
