/* Cipher Atelier: public project explanation with evidence-first language. */
import { Eye, KeyRound, ShieldCheck } from "lucide-react";
import PublicPage from "@/components/PublicPage";

const principles = [
  [KeyRound, "Generate instead of improvising", "The generator combines your chosen character families using browser-provided cryptographic randomness and rejection sampling to avoid modulo bias."],
  [Eye, "Explain the estimate", "The analyzer looks for familiar patterns such as common words, sequences, substitutions, and keyboard walks. Its result is a guessability estimate—not a promise of safety."],
  [ShieldCheck, "Keep the secret local", "Candidate and generated passwords remain in the active browser session. Vaultloom has no password-analysis API and does not send candidate passwords to a scoring service."],
] as const;

export default function About() {
  return <PublicPage eyebrow="About the workbench" ledger="Record 02" title="Practical password feedback, without a password collection service." lede="Vaultloom is a privacy-first learning tool for creating stronger passwords and understanding why predictable choices are easier to guess.">
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#275df5]">Purpose</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.055em]">A password workbench should be honest about its limits.</h2>
        <p className="mt-5 max-w-xl text-sm leading-7 text-black/70">Password quality is about more than counting character types. Vaultloom uses a realistic local estimator to surface recognizable patterns, then explains the evidence it found. It is designed to help users choose a unique password and place it in a trusted password manager.</p>
        <p className="mt-5 max-w-xl text-sm leading-7 text-black/70">The project is maintained by Aurelius as an open-source security learning project. It does not replace multi-factor authentication, breach monitoring, or the password policy enforced by the service where a password is used.</p>
      </div>
      <div className="cipher-public-callout border-l-4 border-[#275df5] bg-[#151619] p-6 text-white">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#94b2ff]">How to use it</p>
        <ol className="mt-5 space-y-4 text-sm leading-6 text-white/70"><li><span className="mr-3 font-mono text-[#94b2ff]">01</span>Generate a unique candidate using the local generator.</li><li><span className="mr-3 font-mono text-[#94b2ff]">02</span>Inspect the score and pattern feedback before you reuse it anywhere.</li><li><span className="mr-3 font-mono text-[#94b2ff]">03</span>Save it in a password manager and enable multi-factor authentication where available.</li></ol>
      </div>
    </div>
    <div className="mt-12 divide-y divide-black/10 border-y border-black/10">{principles.map(([Icon, title, copy], index) => <article className="grid gap-4 py-6 sm:grid-cols-[86px_34px_1fr]" key={title}><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#275df5]">0{index + 1} · evidence</span><Icon className="h-5 w-5 text-[#275df5]" /><div><h3 className="font-display text-lg font-bold">{title}</h3><p className="mt-2 max-w-2xl text-sm leading-7 text-black/65">{copy}</p></div></article>)}</div>
  </PublicPage>;
}
