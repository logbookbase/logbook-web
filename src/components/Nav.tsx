import Link from "next/link";
import { Logo } from "./Logo";

export function Nav({ active }: { active?: "docs" | "verify" | "sdk" | "github" }) {
  const links = [
    { id: "docs", href: "/docs", label: "Docs" },
    { id: "verify", href: "/verify", label: "Verify" },
    { id: "sdk", href: "/sdk", label: "SDK" },
    { id: "github", href: "https://github.com/logbookbase/logbook", label: "GitHub" },
  ];

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg/85 px-8 py-5 backdrop-blur">
      <Link href="/" className="flex items-center gap-2.5 text-[19px] font-bold tracking-tight">
        <Logo size={30} />
        <span>logbook</span>
      </Link>

      <div className="hidden gap-8 text-sm font-medium md:flex">
        {links.map((l) => (
          <Link
            key={l.id}
            href={l.href}
            className={
              active === l.id
                ? "text-accent transition-colors"
                : "text-ink transition-colors hover:text-accent"
            }
          >
            {l.label}
          </Link>
        ))}
      </div>

      
    </nav>
  );
}
