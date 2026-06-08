import Link from "next/link";
import { InstallBlock } from "@/components/InstallBlock";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ReceiptShowcase />
        <CodeSample />
        <Features />
        <Stats />
      </main>
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-24 pt-20 text-center">
      <Link
        href="https://basescan.org"
        className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-accentFaint px-3.5 py-1.5 text-sm font-medium no-underline"
      >
        <span className="inline-flex items-center gap-1 font-semibold text-accent">
          <span className="h-2 w-2 rounded-sm bg-accent" />
          Live
        </span>
        <span className="text-ink">x402 on Base mainnet, 2.8s settlement</span>
        <span className="ml-1 text-accent">→</span>
      </Link>

      <h1 className="mb-8 text-[clamp(48px,7vw,96px)] font-extrabold leading-[1.0] tracking-tight">
        Tamper-proof receipts<br />
        for <span className="text-accent">ai agents<span className="text-accent">.</span></span>
      </h1>

      <p className="mx-auto mb-10 max-w-[620px] text-[17px] leading-relaxed text-muted">
        Logbook is a signed action log for ai agents. Every event is ed25519-signed by the agent, hash-chained to the previous one, and paid for in USDC on Base. Anyone can verify any past action, free.
      </p>

      <div className="mb-4 flex flex-wrap justify-center gap-2.5">
        <Link
          href="/docs#quickstart"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-accentHover"
        >
          Start logging →
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-lg border border-lineStrong bg-white px-6 py-3.5 text-[15px] font-medium transition-colors hover:border-muted"
        >
          Read the docs
        </Link>
      </div>

      <InstallBlock />

      <Link
        href="/agents/did:logbook:demo123abc"
        className="mt-6 inline-block text-sm font-medium text-muted no-underline transition-colors hover:text-accent"
      >
        View a live agent's log <span className="text-faint">↗</span>
      </Link>
    </section>
  );
}





function ReceiptShowcase() {
  const events = [
    { seq: "#004", action: "transfer", meta: "5 USDC → 0x1f65...70F7c", hash: "d5225544775c...ab19f" },
    { seq: "#003", action: "swap", meta: "0.5 ETH → 1240 USDC", hash: "34f04b2fc711...e8c4d" },
    { seq: "#002", action: "claim_fees", meta: "creator fees from agent token", hash: "b34d4e256e57...91fa8" },
    { seq: "#001", action: "register", meta: "genesis event · agent live", hash: "05ecc5434283...4f7b1" },
  ];

  return (
    <section className="relative overflow-hidden bg-ink px-6 py-32 text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.3), transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px]">
        <div className="mb-16 text-center">
          <div className="mb-4 text-sm font-medium text-blue-400">— A receipt for every action</div>
          <h2 className="mx-auto max-w-[800px] text-[clamp(36px,5vw,64px)] font-extrabold leading-tight tracking-tight">
            Sign it. Log it.<br />
            <span className="text-blue-400">Verify it forever.</span>
          </h2>
        </div>

        <div className="mx-auto max-w-[720px]">
          <div
            className="rounded-xl border border-[#1f2937] bg-[#111] p-7 font-mono text-[13px]"
            style={{ boxShadow: "0 24px 64px rgba(37, 99, 235, 0.15)" }}
          >
            <div className="mb-1 flex items-start justify-between border-b border-dashed border-[#1f2937] pb-5">
              <div className="flex items-center gap-2.5">
                <Logo size={32} variant="light" />
                <div>
                  <div className="text-[16px] font-semibold text-white" style={{ fontFamily: "Inter" }}>
                    agent.demo
                  </div>
                  <div className="text-[11px] text-[#9ca3af]" style={{ wordBreak: "break-all", maxWidth: "360px" }}>
                    did:logbook:demo123...example
                  </div>
                </div>
              </div>
              <div className="text-right text-[11px] text-[#9ca3af]">
                4 events
                <br />
                <span className="text-[12px] font-semibold text-green-400" style={{ fontFamily: "Inter" }}>
                  ✓ verified
                </span>
              </div>
            </div>

            {events.map((e) => (
              <div
                key={e.seq}
                className="event-slide grid items-center gap-4 border-b border-dashed border-[#1f2937] py-3.5 last:border-b-0"
                style={{ gridTemplateColumns: "50px 1fr auto" }}
              >
                <div className="text-[11px] text-[#4b5563]">{e.seq}</div>
                <div style={{ fontFamily: "Inter" }}>
                  <div className="text-[14px] font-semibold text-white">{e.action}</div>
                  <div className="mt-0.5 text-[12px] text-[#9ca3af]">{e.meta}</div>
                  <div className="mt-1 font-mono text-[11px] text-blue-400">{e.hash}</div>
                </div>
                <div className="text-[18px] text-green-400">✓</div>
              </div>
            ))}

            <div
              className="mt-2 flex items-center justify-between border-t border-dashed border-[#1f2937] pt-4 text-[12px] text-[#9ca3af]"
              style={{ fontFamily: "Inter" }}
            >
              <span>chain verified · 4 of 4 events</span>
              <Link href="/verify" className="font-medium text-blue-400 no-underline">
                verify ↗
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CodeSample() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-32">
      <div className="mb-16 text-center">
        <div className="mb-4 inline-block text-[13px] font-semibold text-accent">SDK</div>
        <h2 className="mb-4 text-[clamp(36px,5vw,56px)] font-extrabold leading-tight tracking-tight">
          Three lines. <span className="text-accent">Signed.</span>
        </h2>
        <p className="mx-auto max-w-[560px] text-base text-muted">
          Drop in the SDK, register an identity, log an event. The agent's keypair handles signing.
          Bankr pays the x402 challenge automatically.
        </p>
      </div>

      <div className="mx-auto max-w-[760px] overflow-x-auto rounded-xl bg-ink p-8 shadow-soft">
        <pre className="font-mono text-[14px] leading-[1.75] text-[#e5e7eb]">
{`import { Logbook } from '@logbook/sdk';

// one-time: register the agent (free)
const identity = await Logbook.register({ displayName: 'my-agent' });

// log an action ($0.001 USDC via x402)
const logbook = new Logbook(identity);
await logbook.log({ action: 'swap', resource: '0x833...USDC' });

// anyone can verify, anytime (free)
await Logbook.verify({ eventId: 'evt_abc123' });
// → { valid: true, chainLength: 4 }`}
        </pre>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      n: "01",
      title: "Register the agent",
      body: "Generate an ed25519 keypair, sign a registration message, post it. Free, one-time. Your did is bound to your public key.",
    },
    {
      n: "02",
      title: "Log every action",
      body: "Sign the event, post to /events. $0.001 USDC per write via x402 on Base. Bankr agents pay automatically. Settles in 2.8 seconds.",
    },
    {
      n: "03",
      title: "Let anyone verify",
      body: "Paste any event id at /verify. The chain walks from genesis, every signature checked. True or false, with the reason. Free, public.",
    },
  ];

  return (
    <section className="mx-auto max-w-[1200px] px-8 py-32">
      <div className="mb-16 text-center">
        <div className="mb-4 inline-block text-[13px] font-semibold text-accent">How it works</div>
        <h2 className="text-[clamp(36px,5vw,56px)] font-extrabold leading-tight tracking-tight">
          Three calls. <span className="text-accent">That's it.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-[540px] text-base text-muted">
          No accounts. No api keys. The agent's ed25519 keypair is its identity, and a small x402 payment is its access.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.n}
            className="rounded-xl border border-line bg-white p-8 transition-all hover:border-lineStrong hover:shadow-soft"
          >
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-accentFaint font-mono text-base font-semibold text-accent">
              {it.n}
            </div>
            <h3 className="mb-2 text-lg font-bold tracking-tight">{it.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="border-y border-line bg-white px-6 py-20">
      <div className="mx-auto grid max-w-[1100px] gap-12 text-center sm:grid-cols-3">
        <StatItem value="127" label="events logged" />
        <StatItem value="14" label="agents registered" />
        <StatItem value="$0" unit=".13" label="USDC settled on Base" />
      </div>
    </section>
  );
}

function StatItem({ value, unit, label }: { value: string; unit?: string; label: string }) {
  return (
    <div>
      <div className="mb-2 text-[56px] font-extrabold leading-none tracking-tight">
        {value}
        {unit && <span className="text-[28px] font-semibold text-faint">{unit}</span>}
      </div>
      <div className="text-sm font-medium text-muted">{label}</div>
    </div>
  );
}
