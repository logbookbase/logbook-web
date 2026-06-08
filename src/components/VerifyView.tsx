"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { verifyEvent, type VerifyResult } from "@/lib/api";

export default function VerifyPage({ initialId = "" }: { initialId?: string }) {
  const router = useRouter();
  const [id, setId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // auto-verify on mount if initial id was provided via URL
  useEffect(() => {
    if (initialId) {
      void runVerify(initialId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runVerify(target: string) {
    if (!target.trim()) return;
    setLoading(true);
    setSubmitted(true);
    const r = await verifyEvent(target.trim());
    setResult(r);
    setLoading(false);
  }

  async function onVerify(e?: React.FormEvent) {
    e?.preventDefault();
    if (!id.trim()) return;
    await runVerify(id.trim());
    router.push(`/verify/${encodeURIComponent(id.trim())}`, { scroll: false });
  }

  return (
    <>
      <Nav active="verify" />
      <main>
        <section className="mx-auto max-w-[800px] px-6 pb-12 pt-20 text-center">
          <div className="mb-4 inline-block text-[13px] font-semibold text-accent">— Public verification</div>
          <h1 className="mb-4 text-[clamp(40px,6vw,72px)] font-extrabold leading-[1.05] tracking-tight">
            Verify any <span className="text-accent">event.</span>
          </h1>
          <p className="mx-auto max-w-[560px] text-[17px] text-muted">
            Paste an event id below. We walk the chain from genesis, check every signature, and tell you yes or no. Free. No login.
          </p>
        </section>

        <section className="mx-auto max-w-[800px] px-6 pb-20">
          <form
            onSubmit={onVerify}
            className="mb-8 flex gap-2 rounded-xl border border-lineStrong bg-white p-2 shadow-soft transition-all focus-within:border-accent focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.1)]"
          >
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="paste an event id, e.g. 004be951-1b82-489c-ac7a-54b4f397d267"
              className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 font-mono text-sm text-ink outline-none placeholder:text-faint"
            />
            <button
              type="submit"
              disabled={loading || !id.trim()}
              className="whitespace-nowrap rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accentHover disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify →"}
            </button>
          </form>

          {!submitted && <EmptyState />}
          {submitted && !loading && result?.valid && <ValidResult result={result} eventId={id} />}
          {submitted && !loading && result && !result.valid && <InvalidResult result={result} eventId={id} />}
          {submitted && !loading && !result && <ErrorResult eventId={id} />}

          <InfoCard />
        </section>
      </main>
      <Footer />
    </>
  );
}

function EmptyState() {
  return (
    <div className="mb-8 rounded-xl border border-dashed border-lineStrong bg-white p-12 text-center text-faint">
      <div className="mb-3 text-3xl opacity-40">⌕</div>
      <div>Paste any logbook event id to verify.</div>
    </div>
  );
}

function ValidResult({ result, eventId }: { result: VerifyResult; eventId: string }) {
  return (
    <div className="mb-8 rounded-xl border border-line bg-white p-8 shadow-soft">
      <div className="mb-5 flex items-center gap-3 border-b border-line pb-5">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-ok text-[22px] font-bold text-white">
          ✓
        </div>
        <div className="flex-1">
          <div className="text-lg font-bold tracking-tight text-ok">Valid</div>
          <div className="mt-0.5 text-[13px] text-muted">Chain walked from genesis. All signatures checked.</div>
        </div>
      </div>

      <div className="grid grid-cols-[140px_1fr] gap-x-6 gap-y-3 text-sm">
        <Row k="event id" v={eventId} />
        {result.agent_did && <Row k="agent did" v={result.agent_did} />}
        {result.chain_length !== undefined && <Row k="chain length" v={`${result.chain_length} events`} />}
      </div>
    </div>
  );
}

function InvalidResult({ result, eventId }: { result: VerifyResult; eventId: string }) {
  const reasons: Record<string, string> = {
    hash_mismatch: "An event's stored content does not hash to its recorded event_hash. Someone modified the event's data after it was signed.",
    bad_signature: "An event's signature does not match the agent's public key. The chain has a forged or corrupted entry.",
    broken_chain: "An event's prev_hash does not match the previous event's event_hash. Someone tried to insert or remove events.",
    seq_gap: "Sequence numbers are not consecutive. An event is missing or duplicated.",
    agent_missing: "The agent record was not found. The chain references an identity that no longer exists.",
  };

  return (
    <div className="mb-8 rounded-xl border border-line bg-white p-8 shadow-soft">
      <div className="mb-5 flex items-center gap-3 border-b border-line pb-5">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-err text-[22px] font-bold text-white">
          ✕
        </div>
        <div className="flex-1">
          <div className="text-lg font-bold tracking-tight text-err">Invalid</div>
          <div className="mt-0.5 text-[13px] text-muted">Chain integrity check failed.</div>
        </div>
      </div>

      <div className="grid grid-cols-[140px_1fr] gap-x-6 gap-y-3 text-sm">
        <Row k="event id" v={eventId} />
        {result.agent_did && <Row k="agent did" v={result.agent_did} />}
        {result.at_seq !== undefined && <Row k="failed at seq" v={String(result.at_seq)} />}
        {result.reason && <Row k="reason" v={result.reason} bold className="text-err" />}
      </div>

      {result.reason && reasons[result.reason] && (
        <div className="mt-6 rounded-lg border border-red-200 bg-errFaint p-4 text-[13px] text-ink">
          <strong className="mb-1 block text-err">What this means</strong>
          {reasons[result.reason]}
        </div>
      )}
    </div>
  );
}

function ErrorResult({ eventId }: { eventId: string }) {
  return (
    <div className="mb-8 rounded-xl border border-line bg-white p-8 shadow-soft">
      <div className="text-[15px] text-muted">
        Couldn't verify <code className="font-mono text-ink">{eventId}</code>. Either the event doesn't exist or the API is unreachable.
      </div>
    </div>
  );
}

function Row({
  k,
  v,
  bold,
  className,
}: {
  k: string;
  v: string;
  bold?: boolean;
  className?: string;
}) {
  return (
    <>
      <div className="font-medium text-faint">{k}</div>
      <div
        className={`break-all text-[13px] ${bold ? "font-semibold" : "font-mono"} ${className ?? ""}`}
      >
        {v}
      </div>
    </>
  );
}

function InfoCard() {
  return (
    <div className="mt-12 rounded-xl border border-blue-100 bg-accentFaint p-8">
      <h3 className="mb-3 text-[15px] font-bold">How verification works</h3>
      <p className="mb-2 text-[13px] leading-relaxed text-muted">
        Every logbook event is ed25519-signed by the agent and includes a hash of the previous event. To verify, we walk the chain from event <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-ink">#001</code> up through the one you asked about.
      </p>
      <p className="mb-2 text-[13px] leading-relaxed text-muted">
        At each step we re-derive the event's hash from its content, check that hash matches the next event's <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-ink">prev_hash</code>, and confirm the signature against the agent's registered public key.
      </p>
      <p className="text-[13px] leading-relaxed text-muted">
        If any check fails, we return <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-ink">{`{valid: false}`}</code> with the reason and the sequence number where it failed. No payment. No auth. No login.
      </p>
    </div>
  );
}
