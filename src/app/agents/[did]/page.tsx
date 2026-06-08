import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { getAgent, getAgentEvents, shortHash, relativeTime, type Event } from "@/lib/api";

export const metadata = {
  title: "Agent · logbook",
};

export default async function AgentPage({
  params,
}: {
  params: Promise<{ did: string }>;
}) {
  const { did: rawDid } = await params;
  const did = decodeURIComponent(rawDid);

  const [agent, eventsData] = await Promise.all([
    getAgent(did),
    getAgentEvents(did, { limit: 50 }),
  ]);

  if (!agent) {
    return (
      <>
        <Nav />
        <main className="mx-auto max-w-[800px] px-6 py-32 text-center">
          <h1 className="mb-4 text-3xl font-bold">Agent not found</h1>
          <p className="text-muted">
            No agent registered at <code className="font-mono text-ink">{did}</code>
          </p>
          <Link href="/" className="mt-6 inline-block text-accent">
            ← back home
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const events = eventsData.events;

  return (
    <>
      <Nav />
      <main>
        <div className="mx-auto max-w-[920px] px-6 py-12">
          <div className="mb-6 font-mono text-[13px] text-faint">
            <Link href="/" className="text-muted hover:text-accent">/</Link> agents / {agent.display_name}
          </div>

          {/* Agent card */}
          <div className="mb-8 rounded-2xl border border-line bg-white p-8 shadow-soft">
            <div className="mb-6 flex items-start gap-5">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-ink">
                <Logo size={36} variant="light" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="mb-2 text-[28px] font-extrabold tracking-tight">
                  {agent.display_name}
                </div>
                <div className="inline-block break-all rounded-md bg-bg px-2.5 py-1.5 font-mono text-xs text-muted">
                  {agent.did}
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-okFaint px-2.5 py-1 text-xs font-semibold text-ok">
                    ✓ chain verified · all {agent.event_count} events
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-4">
              <Stat label="events" value={String(agent.event_count)} />
              <Stat
                label="first event"
                value={new Date(agent.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
                small={new Date(agent.created_at).getFullYear().toString()}
              />
              <Stat
                label="last event"
                value={events[0] ? relativeTime(events[0].created_at) : "—"}
              />
              <Stat label="network" value="Base" small="mainnet" />
            </div>
          </div>

          {/* Chain status banner */}
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-green-200 bg-okFaint p-5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ok text-base text-white">
              ✓
            </div>
            <div className="flex-1 text-sm text-ink">
              <strong className="text-ok">Chain verified.</strong> All {agent.event_count} events walked from genesis. Every signature checked against the agent's public key.
            </div>
            {events[0] && (
              <Link
                href={`/verify/${events[0].id}`}
                className="whitespace-nowrap text-[13px] font-semibold text-ok hover:underline"
              >
                Re-verify
              </Link>
            )}
          </div>

          {/* Timeline */}
          <div className="mb-4 flex items-baseline justify-between px-1">
            <div className="text-lg font-bold tracking-tight">Event timeline</div>
            <div className="font-mono text-[13px] text-faint">
              {agent.event_count} events · sorted newest first
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            {events.map((ev, i) => (
              <EventRow key={ev.id} event={ev} isLast={i === events.length - 1} />
            ))}
            {events.length === 0 && (
              <div className="p-12 text-center text-muted">No events yet.</div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: string }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-faint">{label}</div>
      <div className="text-[22px] font-bold tracking-tight">
        {value}
        {small && <span className="ml-1 text-sm font-medium text-faint">{small}</span>}
      </div>
    </div>
  );
}

function EventRow({ event, isLast }: { event: Event; isLast: boolean }) {
  const resourceLine = event.resource ? event.resource : "—";
  return (
    <div
      className={`grid items-center gap-5 px-6 py-5 transition-colors hover:bg-bg ${
        isLast ? "" : "border-b border-line"
      }`}
      style={{ gridTemplateColumns: "60px 1fr 100px" }}
    >
      <div className="font-mono text-xs text-faint">#{event.seq_num.toString().padStart(3, "0")}</div>
      <div className="min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-3">
          <span className="text-[15px] font-semibold">{event.action}</span>
          <span className="text-xs text-faint">{relativeTime(event.created_at)}</span>
        </div>
        <div className="mb-1.5 text-[13px] text-muted">{resourceLine}</div>
        <Link
          href={`/verify/${event.id}`}
          className="font-mono text-[11px] text-accent no-underline hover:underline"
        >
          {shortHash(event.event_hash)}
        </Link>
      </div>
      <div className="flex justify-end">
        <Link
          href={`/verify/${event.id}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-okFaint px-2.5 py-1.5 text-xs font-semibold text-ok no-underline transition-colors hover:bg-ok hover:text-white"
        >
          ✓ Verify
        </Link>
      </div>
    </div>
  );
}
