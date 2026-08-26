/* Cipher Atelier: clear support route without pretending a static form is monitored. */
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import PublicPage from "@/components/PublicPage";
import VulnerabilityReportForm from "@/components/VulnerabilityReportForm";

export default function Contact() {
  return <PublicPage eyebrow="Contact and support" ledger="Record 03" title="Use a clear channel. Never send a real password." lede="Project questions can use the repository. Security issues have a separate authenticated intake with limited evidence attachments.">
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#275df5]">Project support</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.055em]">The repository is the public support channel.</h2>
        <p className="mt-5 max-w-xl text-sm leading-7 text-black/70">Open an issue for a reproducible bug, accessibility concern, documentation correction, or feature request. Repository access may be required because the project is private.</p>
        <a className="cipher-contrast-action mt-7 inline-flex items-center gap-2 bg-[#151619] px-5 py-3 font-display text-sm font-bold text-white transition hover:bg-[#275df5]" href="https://github.com/theneotic/vaultloom/issues" rel="noreferrer" target="_blank">Open project support <ArrowUpRight className="h-4 w-4" /></a>
      </div>
      <aside className="cipher-warning border-l-4 border-amber-500 bg-[#fff5dd] p-5 sm:p-6">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-800"><ShieldAlert className="h-4 w-4" /> Security reporting boundary</div>
        <p className="mt-4 text-sm leading-7 text-black/70">Do not post a password, recovery code, API key, authentication token, or personal data in an issue. Describe the behavior without using a live secret. If you identify a serious vulnerability, ask the project owner for a private reporting route first.</p>
      </aside>
    </div>
    <section className="mt-12 border-t border-black/10 pt-8"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#275df5]">Secure vulnerability intake</p><h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.055em]">Submit a report for private review.</h2></div><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/50">Authenticated · bounded upload · no secrets</span></div><VulnerabilityReportForm /></section>
  </PublicPage>;
}
