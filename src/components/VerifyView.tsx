"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import {
  verifyEvent,
  getEvent,
  getAgent,
  shortHash,
  relativeTime,
  type VerifyResult,
  type Event,
  type Agent,
} from "@/lib/api";

export default function VerifyPage({ initialId = "" }: { initialId?: string }) {
  const router = useRouter();
  const [id, setId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [submitted, setSubmitted] = useState(false);

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
    setEvent(null);
    setAgent(null);

    const r = await verifyEvent(target.trim());
    setResult(r);

    if (r?.valid) {
      const ev = await getEvent(target.trim());
      setEvent(ev);
      if (ev?.agent_did) {
        const ag = await getAgent(ev.agent_did);
        setAgent(ag);
      }
    }

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
            Paste an event id below. We walk the chain from genesis, check every signature, and show you what was logged. Free. No login.
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
          {submitted && !loading && result?.valid && (
            <ValidResult result={result} event={event} agent={agent} eventId={id} />
          )}
          {submitted && !loading && result && !result.valid && (
            <InvalidResult result={result} eventId={id} />
          )}
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

function ValidResult({
  result,
  event,
  agent,
  eventId,
}: {
  result: VerifyResult;
  event: Event | null;
  agent: Agent | null;
  eventId: string;
}) {
  const created = event?.created_at ? new Date(event.created_at) : null;

  return (
    <div className="mb-8 rounded-xl border border-line bg-white shadow-soft">
      <div className="flex items-center gap-3 border-b border-line p-6">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-ok text-[22px] font-bold text-white">
          ✓
        </div>
        <div className="flex-1">
          <div className="text-lg font-bold tracking-tight text-ok">Valid</div>
          <div className="mt-0.5 text-[13px] text-muted">
            Chain walked from genesis. All signatures checked.
          </div>
        </div>
        {result.chain_length !== undefined && (
          <div className="text-right text-[13px]">
            <div className="font-semibold text-ink">{result.chain_length} event{result.chain_length === 1 ? "" : "s"}</div>
            <div className="text-faint">in this chain</div>
          </div>
        )}
      </div>

      {event && (
        <div className="border-b border-line p-6">
          <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-faint">
            Action
          </div>
          <div className="font-mono text-2xl font-bold tracking-tight">{event.action}</div>
          {event.resource && (
            <div className="mt-2 break-all font-mono text-[13px] text-muted">
              <span className="text-faint">resource:</span> {event.resource}
            </div>
          )}
          {event.metadata && Object.keys(event.metadata).length > 0 && (
            <MetadataBlock metadata={event.metadata} />
          )}
        </div>
      )}

      {(agent || event) && (
        <div className="border-b border-line p-6">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-faint">
            Logged by
          </div>
          {agent && (
            <div className="mb-1 font-mono text-base font-semibold text-ink">
              {agent.display_name}
            </div>
          )}
          {event && (
            <a
              href={`/agents/${encodeURIComponent(event.agent_did)}`}
              className="break-all font-mono text-[12px] text-accent hover:underline"
            >
              {event.agent_did}
            </a>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {created && (
            <Field
              label="Logged"
              value={
                <>
                  <div className="text-[13px] text-ink">
                    {created.toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="text-[11px] text-faint">{relativeTime(event!.created_at)}</div>
                </>
              }
            />
          )}
          {event && (
            <Field
              label="Sequence"
              value={
                <div className="font-mono text-[13px] text-ink">#{String(event.seq_num).padStart(3, "0")}</div>
              }
            />
          )}
          <Field
            label="Payment"
            value={
              <>
                <div className="text-[13px] text-ink">$0.001 USDC</div>
                <div className="text-[11px] text-faint">x402 on Base mainnet</div>
                <a
                  href="https://basescan.org/address/0x1f652dF44Cc2b73793FAD984e81966EeCBf70F7c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-0.5 text-[11px] text-accent transition-opacity hover:opacity-70"
                >
                  view pay-to wallet on Basescan →
                </a>
              </>
            }
          />
          {event && (
            <Field
              label="Event hash"
              value={
                <div className="break-all font-mono text-[12px] text-ink">
                  {shortHash(event.event_hash, 16, 8)}
                </div>
              }
            />
          )}
        </div>

        <div className="mt-6 border-t border-line pt-6">
          <Field
            label="Shareable verify link"
            value={
              <div className="break-all font-mono text-[12px] text-muted">
                signedlogbook.com/verify/{eventId}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

function MetadataBlock({ metadata }: { metadata: Record<string, unknown> }) {
  return (
    <div className="mt-4">
      <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-faint">
        Metadata
      </div>
      <pre className="overflow-x-auto rounded-md border border-line bg-bg p-3 font-mono text-[12px] leading-relaxed text-ink">
        {JSON.stringify(metadata, null, 2)}
      </pre>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-faint">{label}</div>
      {value}
    </div>
  );
}

function InvalidResult({ result, eventId }: { result: VerifyResult; eventId: string }) {
  const reasons: Record<string, string> = {
    hash_mismatch:
      "An event's stored content does not hash to its recorded event_hash. Someone modified the event's data after it was signed.",
    bad_signature:
      "An event's signature does not match the agent's public key. The chain has a forged or corrupted entry.",
    broken_chain:
      "An event's prev_hash does not match the previous event's event_hash. Someone tried to insert or remove events.",
    seq_gap:
      "Sequence numbers are not consecutive. An event is missing or duplicated.",
    agent_missing:
      "The agent record was not found. The chain references an identity that no longer exists.",
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
        {result.reason && (
          <Row k="reason" v={result.reason} bold className="text-err" />
        )}
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
        Couldn&apos;t verify <code className="font-mono text-ink">{eventId}</code>. Either the event doesn&apos;t exist or the API is unreachable.
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
        At each step we re-derive the event&apos;s hash from its content, check that hash matches the next event&apos;s <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-ink">prev_hash</code>, and confirm the signature against the agent&apos;s registered public key.
      </p>
      <p className="text-[13px] leading-relaxed text-muted">
        If any check fails, we return <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-ink">{`{valid: false}`}</code> with the reason and the sequence number where it failed. No payment. No auth. No login.
      </p>
    </div>
  );
}
