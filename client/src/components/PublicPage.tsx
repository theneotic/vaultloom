/* Cipher Atelier public page shell: clear identity, durable navigation, and support footer. */
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import ThemeToggle from "@/components/ThemeToggle";
import VaultloomMark from "@/components/VaultloomMark";

type PublicPageProps = {
  eyebrow: string;
  ledger: string;
  title: string;
  lede: string;
  children: ReactNode;
};

const navItems = [
  ["Workbench", "/"],
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
] as const;

export default function PublicPage({ eyebrow, ledger, title, lede, children }: PublicPageProps) {
  const [location] = useLocation();

  return (
    <div className="cipher-page min-h-screen overflow-x-clip bg-[#101216] text-[#f5f1e8]">
      <header className="cipher-header border-b border-l-8 border-white/10 border-l-[#275df5] bg-[#0d0f13]">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-10 sm:py-5 lg:px-14">
          <div className="flex items-center justify-between gap-4">
            <Link className="flex min-w-0 items-center gap-3" href="/">
            <VaultloomMark className="h-11 w-11" label="Vaultloom glyph" />
            <span className="font-display text-base font-bold tracking-[-0.055em] text-white">[VAULT/LOOM]</span>
            </Link>
            <ThemeToggle />
          </div>
          <nav aria-label="Primary navigation" className="mt-3 grid grid-cols-5 gap-1 border-t border-white/10 pt-2 font-mono text-[9px] uppercase tracking-[0.08em] text-white/65 sm:mt-4 sm:flex sm:gap-2 sm:text-[11px] sm:tracking-[0.15em]">
            {navItems.map(([label, href]) => {
              const isCurrent = location === href;
              return <Link aria-current={isCurrent ? "page" : undefined} className={`flex min-h-11 min-w-0 items-center justify-center border-b-2 px-1 py-2 text-center transition sm:min-h-10 sm:shrink-0 sm:px-4 sm:py-3 ${isCurrent ? "border-[#275df5] bg-white/5 text-[#b9ccff]" : "border-transparent hover:border-white/30 hover:text-[#94b2ff]"}`} href={href} key={href}>{label}</Link>;
            })}
          </nav>
        </div>
      </header>

      <main>
        <section className="cipher-public-hero border-b border-l-8 border-white/10 border-l-[#275df5] bg-[linear-gradient(135deg,rgba(39,93,245,0.18),transparent_48%)] px-4 py-11 sm:px-10 sm:py-14 lg:px-14 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#94b2ff]">{eyebrow}</p>
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55 sm:tracking-[0.18em]"><span className="grid h-5 w-5 place-items-center border border-[#275df5] text-[#94b2ff]">{ledger.slice(-2)}</span>{ledger} · local record</p>
            </div>
            <h1 className="mt-5 max-w-4xl font-display text-[2.35rem] font-bold leading-[0.98] tracking-[-0.065em] text-white sm:text-6xl">{title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/65">{lede}</p>
          </div>
        </section>

        <section className="cipher-public-workspace bg-[#eeeae0] px-4 py-7 text-[#151619] sm:px-10 sm:py-10 lg:px-14 lg:py-14">
          <div className="cipher-public-surface mx-auto max-w-6xl border border-l-[5px] border-black/15 border-l-[#275df5] bg-[#f7f4ec] p-5 shadow-[6px_6px_0_#111318] sm:p-10 sm:shadow-[9px_9px_0_#111318]">
            {children}
          </div>
        </section>
      </main>

      <footer className="cipher-footer border-l-8 border-l-[#275df5] bg-[#151619] px-4 py-9 sm:px-10 lg:px-14">
        <div className="mx-auto grid max-w-6xl gap-8 border-t border-white/10 pt-7 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <p className="font-display text-lg font-bold tracking-[-0.045em] text-white">[VAULT/LOOM]</p>
            <p className="mt-3 max-w-sm text-xs leading-5 text-white/45">A private password workbench maintained by Aurelius. The app has no password-analysis API and keeps password work in the active browser tab.</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#94b2ff]">Explore</p>
            <div className="mt-3 space-y-2 text-sm text-white/60"><Link className="block hover:text-white" href="/">Workbench</Link><Link className="block hover:text-white" href="/about">About</Link><Link className="block hover:text-white" href="/contact">Contact</Link></div>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#94b2ff]">Trust</p>
            <div className="mt-3 space-y-2 text-sm text-white/60"><Link className="block hover:text-white" href="/privacy">Privacy</Link><Link className="block hover:text-white" href="/terms">Terms</Link><a className="inline-flex items-center gap-1 hover:text-white" href="https://github.com/theneotic/vaultloom" rel="noreferrer" target="_blank">Source <ArrowUpRight className="h-3.5 w-3.5" /></a></div>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">© 2026 Aurelius · Vaultloom</div>
      </footer>
    </div>
  );
}
