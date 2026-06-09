import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = {
  title: "SDK reference · logbook",
  description: "Full method-by-method reference for @logbook/sdk. TypeScript-first, three core methods, x402 payment handled automatically.",
};

export default function SdkPage() {
  return (
    <>
      <Nav active="sdk" />
      <main className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[220px_1fr]">

          {/* Sidebar TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-faint">On this page</div>
              <ul className="space-y-2 text-[13px]">
                <TocLink href="#install">Install</TocLink>
                <TocLink href="#quickstart">Quickstart</TocLink>
                <TocLink href="#register">Logbook.register()</TocLink>
                <TocLink href="#constructor">new Logbook()</TocLink>
                <TocLink href="#log">logbook.log()</TocLink>
                <TocLink href="#verify">Logbook.verify()</TocLink>
                <TocLink href="#errors">Errors</TocLink>
                <TocLink href="#runtime">Runtime support</TocLink>
                <TocLink href="#x402">x402 payment</TocLink>
              </ul>
            </div>
          </aside>

          {/* Main */}
          <div>
            <div className="mb-4 text-[13px] font-semibold text-accent">SDK reference</div>
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight">@logbook/sdk</h1>
            <p className="mb-12 max-w-[680px] text-lg text-muted">
              The official TypeScript SDK for logbook. Three public methods, full x402 payment handling, ed25519 signing baked in. Works in Node, Bun, Deno, and modern browsers with global fetch.
            </p>

            <div className="mb-12 grid gap-3 sm:grid-cols-3">
              <Pill label="Methods" value="3" />
              <Pill label="Runtime" value="Node 18+" />
              <Pill label="License" value="MIT" />
            </div>

            <Section id="install" title="Install">
              <CodeBlock language="bash">{`npm install @logbook/sdk`}</CodeBlock>
              <p>
                Source on GitHub:{" "}
                <Ext href="https://github.com/logbookbase/logbook/tree/main/sdk">github.com/logbookbase/logbook/tree/main/sdk</Ext>
              </p>
              <p className="text-sm text-muted">
                Python and Go SDKs are on the roadmap. Until then, any HTTP client works — see the{" "}
                <Link href="/docs#quickstart" className="text-accent hover:underline">REST docs</Link>.
              </p>
            </Section>

            <Section id="quickstart" title="Quickstart">
              <p>Three calls — register the agent, log an event, verify any past event.</p>

              <CodeBlock language="ts">{`import { Logbook } from '@logbook/sdk';

// 1. register once, persist the identity somewhere safe
const identity = await Logbook.register({
  displayName: 'my-agent',
  metadata: { framework: 'langchain' },
});
// identity = { did, publicKey, privateKey }

// 2. log an action — pays $0.001 USDC via x402
const logbook = new Logbook({
  did: identity.did,
  privateKey: identity.privateKey,
});
const event = await logbook.log({
  action: 'swap',
  resource: '0x833589fCD6...USDC',
  metadata: { from: 'ETH', to: 'USDC', amount: '0.5' },
});

// 3. anyone can verify (free, public, no auth)
const result = await Logbook.verify({ eventId: event.id });
// result = { valid: true, chainLength: 1 }`}</CodeBlock>
            </Section>

            <Section id="register" title="Logbook.register()">
              <p>Static method. Generates an ed25519 keypair locally, signs the registration message, posts to the API. Free, one-time per identity. Returns the new identity including the private key — store it securely.</p>

              <Signature>{`Logbook.register(options: RegisterOptions): Promise<Identity>`}</Signature>

              <H4>Parameters</H4>
              <ParamTable
                rows={[
                  ["displayName", "string", "Human-readable name for the agent. 1–64 chars."],
                  ["metadata", "object?", "Free-form JSON, default {}. Visible on the public profile."],
                  ["baseUrl", "string?", "Override the API URL. Defaults to https://api.signedlogbook.com."],
                ]}
              />

              <H4>Returns</H4>
              <CodeBlock language="ts">{`type Identity = {
  did: string;          // did:logbook:<base58>
  publicKey: string;    // 64 hex chars
  privateKey: string;   // 64 hex chars — keep this secret
};`}</CodeBlock>

              <H4>Example</H4>
              <CodeBlock language="ts">{`const identity = await Logbook.register({
  displayName: 'trading-bot-v2',
  metadata: { framework: 'crewai', version: '0.74' },
});

console.log(identity.did);
// → did:logbook:HLMnau36uvQ2ZhAtYUTqMaef6sUkKs3EAyxqC8tLb8pA

// persist privately — fs.writeFile, secrets manager, etc.
await fs.writeFile('.logbook.json', JSON.stringify(identity));`}</CodeBlock>

              <Callout type="warn">
                The private key never leaves your machine — it's generated locally and only the public key is sent to the API. If you lose it, the identity is unrecoverable. Existing events stay verifiable, but no new ones can be written.
              </Callout>
            </Section>

            <Section id="constructor" title="new Logbook()">
              <p>Instantiate with an existing identity to start logging events.</p>

              <Signature>{`new Logbook(options: LogbookOptions): Logbook`}</Signature>

              <H4>Parameters</H4>
              <ParamTable
                rows={[
                  ["did", "string", "The agent's did, returned from register()."],
                  ["privateKey", "string", "The agent's ed25519 private key (64 hex)."],
                  ["baseUrl", "string?", "Override the API URL. Defaults to https://api.signedlogbook.com."],
                ]}
              />

              <H4>Example</H4>
              <CodeBlock language="ts">{`// load identity from wherever you persisted it
const identity = JSON.parse(await fs.readFile('.logbook.json', 'utf8'));

const logbook = new Logbook({
  did: identity.did,
  privateKey: identity.privateKey,
});`}</CodeBlock>
            </Section>

            <Section id="log" title="logbook.log()">
              <p>Instance method. Signs the event payload, pays the x402 challenge ($0.001 USDC on Base), posts to <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-sm">/events</code>. The SDK fetches the latest chain head automatically — you do not track <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-sm">prev_hash</code> or <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-sm">seq_num</code> yourself.</p>

              <Signature>{`logbook.log(event: LogEvent): Promise<Event>`}</Signature>

              <H4>Parameters</H4>
              <ParamTable
                rows={[
                  ["action", "string", "Short verb describing what the agent did. 1–128 chars. Examples: swap, transfer, claim_fees, send_email."],
                  ["resource", "string | null", "What was acted on. Token address, recipient, URL, file path. Up to 512 chars. Optional."],
                  ["metadata", "object?", "Free-form JSON with details. Default {}. Becomes part of the canonical signed payload."],
                ]}
              />

              <H4>Returns</H4>
              <CodeBlock language="ts">{`type Event = {
  id: string;             // uuid
  agentDid: string;
  seqNum: number;
  action: string;
  resource: string | null;
  metadata: Record<string, unknown>;
  signature: string;      // 128 hex
  prevHash: string;       // 64 hex
  eventHash: string;      // 64 hex
  x402TxHash: string;     // base tx hash from the x402 settlement
  createdAt: string;      // ISO 8601
};`}</CodeBlock>

              <H4>Example</H4>
              <CodeBlock language="ts">{`const event = await logbook.log({
  action: 'swap',
  resource: '0x833589fCD6...USDC',
  metadata: {
    from: 'ETH',
    to: 'USDC',
    amountIn: '0.5',
    amountOut: '1240.50',
    slippageBps: 50,
    txHash: '0xabc...',
  },
});

console.log(event.id);
// → 004be951-1b82-489c-ac7a-54b4f397d267

console.log(\`https://signedlogbook.com/verify/\${event.id}\`);
// share this link; anyone can verify it`}</CodeBlock>

              <Callout type="info">
                The agent's wallet must hold at least $0.001 USDC on Base to log an event. If you run inside a Bankr agent, payment is handled by the Bankr wallet automatically. Otherwise, fund the wallet whose key signs the EIP-3009 transferWithAuthorization.
              </Callout>
            </Section>

            <Section id="verify" title="Logbook.verify()">
              <p>Static method. Walks the chain from genesis to this event, re-derives every hash, and checks every signature against the agent's registered public key. Free, no auth, no payment.</p>

              <Signature>{`Logbook.verify(options: VerifyOptions): Promise<VerifyResult>`}</Signature>

              <H4>Parameters</H4>
              <ParamTable
                rows={[
                  ["eventId", "string", "The event id to verify."],
                  ["baseUrl", "string?", "Override the API URL. Defaults to https://api.signedlogbook.com."],
                ]}
              />

              <H4>Returns</H4>
              <CodeBlock language="ts">{`type VerifyResult =
  | { valid: true; eventId: string; agentDid: string; chainLength: number }
  | { valid: false; reason: VerifyReason; atSeq?: number };

type VerifyReason =
  | 'hash_mismatch'   // event content was modified after signing
  | 'bad_signature'   // signature does not match agent's public key
  | 'broken_chain'    // prev_hash links inconsistent
  | 'seq_gap'         // missing or duplicate sequence number
  | 'agent_missing';  // agent record no longer exists`}</CodeBlock>

              <H4>Example</H4>
              <CodeBlock language="ts">{`const result = await Logbook.verify({
  eventId: '004be951-1b82-489c-ac7a-54b4f397d267',
});

if (result.valid) {
  console.log(\`chain ok, \${result.chainLength} events\`);
} else {
  console.error(\`invalid: \${result.reason} at seq \${result.atSeq}\`);
}`}</CodeBlock>
            </Section>

            <Section id="errors" title="Errors">
              <p>All SDK methods throw <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-sm">LogbookError</code> on failure. The error includes <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-sm">statusCode</code>, <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-sm">code</code>, and <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-sm">message</code> fields.</p>

              <CodeBlock language="ts">{`import { LogbookError } from '@logbook/sdk';

try {
  await logbook.log({ action: 'swap' });
} catch (err) {
  if (err instanceof LogbookError) {
    console.error(err.code, err.message);
    if (err.code === 'bad_prev_hash') {
      // chain head changed mid-flight — retry
    }
  }
}`}</CodeBlock>

              <H4>Common error codes</H4>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="py-2 text-left font-semibold">code</th>
                    <th className="py-2 text-left font-semibold">status</th>
                    <th className="py-2 text-left font-semibold">when it happens</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  <ErrRow code="invalid_body" status="400" when="Wrong shape or missing required field" />
                  <ErrRow code="bad_signature" status="401" when="Signature does not match the agent's public key" />
                  <ErrRow code="unknown_agent" status="404" when="Calling log() before register(), or wrong did" />
                  <ErrRow code="bad_prev_hash" status="409" when="Chain head moved since last fetch — retry log()" />
                  <ErrRow code="bad_seq_num" status="409" when="Sequence number does not match expected next" />
                  <ErrRow code="server_error" status="5xx" when="API outage — SDK retries with backoff" />
                  <ErrRow code="network_error" status="—" when="Connection failed after retries exhausted" />
                </tbody>
              </table>
            </Section>

            <Section id="runtime" title="Runtime support">
              <ul className="space-y-2 text-[15px]">
                <li><strong>Node.js</strong> — 18 or higher (uses global fetch)</li>
                <li><strong>Bun</strong> — 1.0+</li>
                <li><strong>Deno</strong> — 1.40+ (use the npm: specifier)</li>
                <li><strong>Browser</strong> — modern, but keeping the private key in browser storage is risky. Recommended only for read paths (verify).</li>
              </ul>
              <p className="text-sm text-muted">
                For older Node versions, pass a fetch implementation via <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-sm">{`new Logbook({ ..., fetch: customFetch })`}</code>.
              </p>
            </Section>

            <Section id="x402" title="x402 payment">
              <p>Every call to <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-sm">log()</code> costs $0.001 USDC on Base. The SDK handles this automatically using <Ext href="https://github.com/coinbase/x402">@x402/fetch</Ext> under the hood — you do not see the 402 challenge unless something fails.</p>

              <H4>How payment works</H4>
              <ol className="list-decimal space-y-2 pl-6 text-[15px]">
                <li>Your call to <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-sm">log()</code> sends a signed event to <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-sm">POST /events</code>.</li>
                <li>The server returns 402 with a <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-sm">PAYMENT-REQUIRED</code> header.</li>
                <li>The SDK signs an EIP-3009 transferWithAuthorization for 1000 atomic USDC ($0.001).</li>
                <li>The SDK retries the request with the <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-sm">PAYMENT-SIGNATURE</code> header.</li>
                <li>Coinbase's facilitator settles the USDC transfer on Base in ~2.8 seconds.</li>
                <li>The event row is returned with <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-sm">x402TxHash</code> for on-chain proof.</li>
              </ol>

              <H4>Inside Bankr</H4>
              <p>
                If your agent runs as a Bankr-hosted skill, the Bankr wallet pays automatically. No additional setup required — <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-sm">log()</code> just works.
              </p>

              <H4>Outside Bankr</H4>
              <p>
                Fund the wallet whose private key signs the event. The wallet needs at least $0.001 USDC plus a few cents of ETH for gas. The SDK respects <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-sm">BUYER_WALLET_PRIVATE_KEY</code> env var by default; configure your own via{" "}
                <Link href="/docs#sdk" className="text-accent hover:underline">the wallet adapter</Link>.
              </p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function TocLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        className="block text-muted transition-colors hover:text-accent"
      >
        {children}
      </a>
    </li>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-24 border-b border-line pb-16 last:border-b-0">
      <h2 className="mb-6 text-3xl font-bold tracking-tight">{title}</h2>
      <div className="space-y-4 text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}

function H4({ children }: { children: React.ReactNode }) {
  return <h4 className="mt-6 mb-2 text-sm font-semibold uppercase tracking-wider text-faint">{children}</h4>;
}

function Signature({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-line bg-bg p-4 font-mono text-[13px] text-ink">
      {children}
    </div>
  );
}

function ParamTable({ rows }: { rows: [string, string, string][] }) {
  return (
    <table className="my-4 w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-line">
          <th className="w-32 py-2 text-left font-semibold">name</th>
          <th className="w-32 py-2 text-left font-semibold">type</th>
          <th className="py-2 text-left font-semibold">description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([name, type, desc]) => (
          <tr key={name} className="border-b border-line/50 last:border-b-0">
            <td className="py-2 pr-4 font-mono text-[13px] text-ink">{name}</td>
            <td className="py-2 pr-4 font-mono text-[13px] text-muted">{type}</td>
            <td className="py-2 text-[13px] text-muted">{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ErrRow({ code, status, when }: { code: string; status: string; when: string }) {
  return (
    <tr className="border-b border-line/50 last:border-b-0">
      <td className="py-2 pr-4 font-mono text-[13px] text-err">{code}</td>
      <td className="py-2 pr-4 font-mono text-[13px] text-muted">{status}</td>
      <td className="py-2 text-muted">{when}</td>
    </tr>
  );
}

function Callout({ type, children }: { type: "info" | "warn"; children: React.ReactNode }) {
  const cls =
    type === "warn"
      ? "border-amber-200 bg-amber-50"
      : "border-blue-100 bg-accentFaint";
  return (
    <div className={`my-4 rounded-lg border ${cls} p-4 text-[13px] leading-relaxed text-ink`}>
      {children}
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-faint">{label}</div>
      <div className="font-mono text-xl font-bold tracking-tight">{value}</div>
    </div>
  );
}

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline-offset-2 hover:underline"
    >
      {children}
    </a>
  );
}
