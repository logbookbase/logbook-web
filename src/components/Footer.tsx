import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg px-8 py-20">
      <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-[20px] font-bold tracking-tight">
            <Logo size={28} />
            <span>logbook</span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Tamper-proof signed action logs for ai agents. Built on Base. Paid in USDC via x402.
          </p>
        </div>

        <FooterCol title="Product">
          <FooterLink href="/docs">Docs</FooterLink>
          <FooterLink href="/sdk">SDK reference</FooterLink>
          <FooterLink href="/verify">Verify</FooterLink>
          <FooterLink href="/docs#pricing">Pricing</FooterLink>
        </FooterCol>

        <FooterCol title="Built on">
          <FooterLink href="https://base.org">Base</FooterLink>
          <FooterLink href="https://x402.org">x402 protocol</FooterLink>
          <FooterLink href="https://docs.cdp.coinbase.com/x402">Coinbase CDP</FooterLink>
          <FooterLink href="https://bankr.bot">Bankr</FooterLink>
        </FooterCol>

        <FooterCol title="Community">
          <FooterLink href="https://github.com/logbookbase/logbook">GitHub</FooterLink>
          <FooterLink href="https://x.com/logbookonbase">X / Twitter</FooterLink>
          <FooterLink href="/docs#bankr">Bankr skill</FooterLink>
        </FooterCol>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1200px] flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-xs text-faint">
        <span>© 2026 logbook · MIT licensed</span>
        <span>built on Base · paid in USDC via x402</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-[13px] font-semibold text-ink">{title}</h4>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="py-1 text-[13px] text-muted transition-colors hover:text-ink"
    >
      {children}
    </Link>
  );
}
