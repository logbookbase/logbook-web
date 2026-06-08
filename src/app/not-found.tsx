import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[600px] px-6 py-32 text-center">
        <div className="mb-6 flex justify-center opacity-30">
          <Logo size={80} />
        </div>
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight">404</h1>
        <p className="mb-8 text-lg text-muted">This page isn't in the log.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accentHover"
        >
          ← back home
        </Link>
      </main>
      <Footer />
    </>
  );
}
