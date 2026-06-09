import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = {
  title: "Docs · logbook",
  description: "How to use logbook: register your agent, log events, and verify the chain.",
};

export default function DocsPage() {
  return (
    <>
      <Nav active="docs" />
      <main className="mx-auto max-w-[800px] px-6 py-16">
        <div className="mb-4 text-[13px] font-semibold text-accent">Documentation</div>
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight">Build with logbook.</h1>
        <p className="mb-12 text-lg text-muted">
          The full reference lives in the GitHub repo. This page is the quickstart so you can ship your first signed event in 60 seconds.
        </p>

        <Section id="quickstart" title="Quickstart">
          <p>Three calls — register the agent (free), log an event ($0.001 USDC), verify any past event (free).</p>

          <CodeBlock>
{`# install the sdk
npm install @logbook/sdk

# in your code
import { Logbook } from '@logbook/sdk';

// 1. one-time: register an identity
const identity = await Logbook.register({ displayName: 'my-agent' });
console.log(identity.did);  // did:logbook:HLMnau36uv...

// 2. log every action ($0.001 USDC via x402)
const logbook = new Logbook(identity);
const event = await logbook.log({
  action: 'swap',
  resource: '0x833589fCD6...USDC',
  metadata: { from: 'ETH', to: 'USDC', amount: '0.5' }
});

// 3. anyone can verify (free, public)
const proof = await Logbook.verify(event.id);
// { valid: true, chainLength: 1 }`}
          </CodeBlock>

          <p>
            For full request/response schemas, error codes, and the canonical signature algorithm, see{" "}
            <Ext href="https://github.com/logbookbase/logbook/blob/main/README.md">the README on GitHub</Ext>.
          </p>
        </Section>

        <Section id="sdk" title="SDK">
          <p>
            The official TypeScript SDK ships as <code className="rounded bg-bg px-1.5 py-0.5 font-mono text-sm">@logbook/sdk</code>. It handles canonical message serialization, ed25519 signing, x402 payment retry, and chain head caching.
          </p>
          <p>
            For the full method-by-method reference (parameters, return types, error codes), see <Link href="/sdk" className="text-accent underline-offset-2 hover:underline">the SDK reference page</Link>.
          </p>
          <p>
            Source:{" "}
            <Ext href="https://github.com/logbookbase/logbook/tree/main/sdk">github.com/logbookbase/logbook/tree/main/sdk</Ext>
          </p>
          <p>
            Python and Go SDKs are on the roadmap. Until then, calls can be made directly via curl or any HTTP client — see the API reference in the repo.
          </p>
        </Section>

        <Section id="pricing" title="Pricing">
          <ul className="space-y-3">
            <li className="flex justify-between border-b border-line pb-3">
              <span className="font-medium">Register an agent</span>
              <span className="font-mono text-sm text-ok">free</span>
            </li>
            <li className="flex justify-between border-b border-line pb-3">
              <span className="font-medium">Log an event</span>
              <span className="font-mono text-sm">$0.001 USDC</span>
            </li>
            <li className="flex justify-between border-b border-line pb-3">
              <span className="font-medium">Verify an event</span>
              <span className="font-mono text-sm text-ok">free</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Read agent + event history</span>
              <span className="font-mono text-sm text-ok">free</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted">
            Writes settle on Base via x402. Bankr agents pay automatically; non-Bankr clients use <Ext href="https://github.com/x402-org/x402">@x402/fetch</Ext> or sign the EIP-3009 transfer manually.
          </p>
        </Section>

        <Section id="bankr" title="Bankr integration">
          <p>
            Logbook is shipped as a Bankr skill. Any Bankr-hosted agent can install it and start logging without writing code.
          </p>
          <CodeBlock>{`bankr skills add github.com/logbookbase/logbook`}</CodeBlock>
          <p>
            After install, the agent knows when to log (trades, transfers, token launches, automated decisions) and handles the x402 payment using the agent's own wallet.
          </p>
          <p>
            See{" "}
            <Ext href="https://docs.bankr.bot/skills/overview">docs.bankr.bot</Ext> for the Bankr skill system overview.
          </p>
        </Section>

        <Section id="repo" title="Source">
          <p>
            Logbook is open source under MIT. Issues, PRs, and questions welcome.
          </p>
          <Ext href="https://github.com/logbookbase/logbook">github.com/logbookbase/logbook ↗</Ext>
        </Section>
      </main>
      <Footer />
    </>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-24">
      <h2 className="mb-4 text-2xl font-bold tracking-tight">{title}</h2>
      <div className="space-y-4 text-[15px] leading-relaxed text-ink">{children}</div>
    </section>
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
