/* Cipher Atelier: an asymmetric, evidence-first password security workbench. */
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Clipboard,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import ThemeToggle from "@/components/ThemeToggle";
import VaultloomMark from "@/components/VaultloomMark";
import {
  formatGuesses,
  generatePassword,
  strengthScale,
  type CharacterSet,
} from "@/lib/password-security";
import type { PasswordAnalysis } from "@/lib/password-analysis";

export default function Home() {
  const [password, setPassword] = useState("");
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("K7@rT4#nY8!mQ2$wP6");
  const [length, setLength] = useState(18);
  const [enabled, setEnabled] = useState<Record<CharacterSet, boolean>>({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const activeSets = useMemo(
    () => (Object.keys(enabled) as CharacterSet[]).filter((key) => enabled[key]),
    [enabled],
  );

  useEffect(() => {
    if (!password) {
      setAnalysis(null);
      return;
    }
    let active = true;
    const timer = window.setTimeout(() => {
      void import("@/lib/password-analysis").then(({ analyzePassword }) => {
        if (active) setAnalysis(analyzePassword(password));
      });
    }, 180);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [password]);

  const analysisMeta = analysis ? strengthScale[analysis.score] : strengthScale[0];
  const offlineTime = analysis?.crackTimes.offlineSlowHashingXPerSecond.display ?? "—";

  const generate = () => {
    if (!activeSets.length) {
      toast.error("Choose at least one character family.");
      return;
    }
    const next = generatePassword(length, activeSets);
    setGeneratedPassword(next);
    setCopied(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      toast.success("Password copied. Store it in a trusted password manager.");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Clipboard access was unavailable. Copy the password manually.");
    }
  };

  return (
    <div className="cipher-page min-h-screen overflow-x-clip bg-[#101216] text-[#f5f1e8] selection:bg-[#275df5] selection:text-white">
      <aside className="cipher-sidebar hidden min-h-screen w-[272px] flex-col justify-between border-r border-white/10 bg-[#0b0d10] px-7 py-8 lg:fixed lg:inset-y-0 lg:left-0 lg:flex">
        <div>
          <a className="group flex items-center gap-3" href="#workbench" aria-label="Vaultloom home">
            <VaultloomMark className="h-10 w-10" label="Vaultloom mark" />
            <span className="font-display text-[17px] font-bold tracking-[-0.05em] text-white">VAULT/LOOM</span>
          </a>
          <div className="mt-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#78a0ff]">Workspace index</p>
            <nav className="mt-5 space-y-2" aria-label="Workbench sections">
              {["01 / Analyze", "02 / Generate", "03 / Principles"].map((item, index) => (
                <a
                  className={`flex items-center justify-between border-l py-3 pl-4 font-display text-sm transition-colors ${index === 0 ? "border-[#275df5] text-white" : "border-white/10 text-white/45 hover:border-white/40 hover:text-white"}`}
                  href={index === 0 ? "#analyze" : index === 1 ? "#generate" : "#principles"}
                  key={item}
                >
                  {item}<ChevronRight className="h-4 w-4" />
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_#34d399]" /> Local-only operation
          </div>
          <p className="mt-3 text-xs leading-5 text-white/45">This page does not transmit or persist the passwords you type or generate.</p>
        </div>
      </aside>

      <main className="lg:ml-[272px]" id="workbench">
        <header className="cipher-header relative overflow-hidden border-b border-l-8 border-white/10 border-l-[#275df5] px-4 py-7 sm:px-10 lg:px-14 lg:py-11">
          <div className="cipher-header-texture pointer-events-none absolute inset-0 opacity-70" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[36%] border-l border-white/10 bg-[linear-gradient(135deg,transparent_0%,rgba(39,93,245,0.16)_52%,transparent_53%),linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:auto,22px_22px] lg:block" />
          <div className="relative max-w-6xl">
            <div className="mb-7 border-b border-white/10 pb-4 sm:mb-8">
              <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <VaultloomMark className="h-9 w-9" label="Vaultloom glyph" />
                <span className="font-display text-base font-bold tracking-[-0.055em] text-white">[VAULT/LOOM]</span>
              </div>
                <ThemeToggle />
              </div>
              <nav aria-label="Primary navigation" className="mt-3 grid grid-cols-5 gap-1 font-mono text-[9px] uppercase tracking-[0.08em] text-white/65 sm:flex sm:gap-2 sm:text-[11px] sm:tracking-[0.15em]">
                <a aria-current="page" className="flex min-h-11 min-w-0 items-center justify-center border-b-2 border-[#275df5] bg-white/5 px-1 py-2 text-center text-[#b9ccff] sm:min-h-10 sm:shrink-0 sm:px-4 sm:py-3" href="#workbench">Workbench</a>
                {[["About", "/about"], ["Contact", "/contact"], ["Privacy", "/privacy"], ["Terms", "/terms"]].map(([label, href]) => <Link className="flex min-h-11 min-w-0 items-center justify-center border-b-2 border-transparent px-1 py-2 text-center transition hover:border-white/30 hover:text-[#94b2ff] sm:min-h-10 sm:shrink-0 sm:px-4 sm:py-3" href={href} key={href}>{label}</Link>)}
              </nav>
            </div>
            <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#94b2ff] lg:hidden">
              <VaultloomMark className="h-7 w-7" /> VAULT/LOOM · Local workbench
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#94b2ff]">Privacy-first password instrumentation</p>
            <h1 className="mt-4 max-w-3xl font-display text-[2.35rem] font-bold leading-[0.98] tracking-[-0.065em] text-white sm:text-6xl lg:text-7xl">
              Measure guessability.<br /><span className="text-[#8baaff]">Keep the secret here.</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-6 text-white/65 sm:text-base">A local workbench for generating passwords with unbiased browser randomness and inspecting common patterns with a realistic estimator.</p>
            <div className="mt-7 flex flex-wrap items-center gap-3"><a className="inline-flex items-center gap-2 bg-[#275df5] px-4 py-3 font-display text-sm font-bold text-white transition hover:bg-white hover:text-[#151619]" href="#analyze"><Zap className="h-4 w-4" /> Test the live demo</a><a className="inline-flex items-center gap-2 border border-white/25 px-4 py-3 font-display text-sm font-bold text-white transition hover:border-white hover:bg-white/10" href="#generate"><KeyRound className="h-4 w-4" /> Generate locally</a><span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#94b2ff]">No sign-up · runs in this tab</span></div>
          </div>
        </header>

        <div className="cipher-workspace bg-[#eeeae0] px-4 py-6 text-[#151619] sm:px-10 sm:py-10 lg:px-14 lg:py-14">
          <section aria-label="Workbench sequence" className="mb-7 grid max-w-6xl overflow-hidden border border-black/15 border-l-[5px] border-l-[#275df5] bg-[#f7f4ec] shadow-[6px_6px_0_#111318] sm:mb-10 sm:grid-cols-3 sm:shadow-[9px_9px_0_#111318]">
            {[
              ["01", "Analyze", "Check a candidate in this browser tab."],
              ["02", "Interpret", "Read the pattern evidence and assumptions."],
              ["03", "Generate", "Create a fresh candidate when you need one."],
            ].map(([number, label, copy]) => <a className="group grid grid-cols-[2.25rem_1fr] gap-3 border-b border-black/10 px-4 py-4 last:border-b-0 hover:bg-[#e8eeff] sm:block sm:border-b-0 sm:border-r sm:px-5 sm:last:border-r-0" href={label === "Analyze" ? "#analyze" : label === "Generate" ? "#generate" : "#principles"} key={number}><span className="font-mono text-[10px] tracking-[0.18em] text-[#275df5] sm:block">{number}</span><div className="sm:mt-3"><p className="font-display text-sm font-bold">{label}</p><p className="mt-1 text-xs leading-5 text-black/60">{copy}</p></div></a>)}
          </section>

          <section className="grid max-w-6xl gap-8 xl:grid-cols-[1.45fr_0.78fr]" id="analyze">
            <div className="cipher-panel border border-l-[5px] border-black/15 border-l-[#275df5] bg-[#f7f4ec] p-4 shadow-[6px_6px_0_#111318] sm:p-8 sm:shadow-[9px_9px_0_#111318]">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-6">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#275df5]"><Zap className="h-3.5 w-3.5" /> Live local analysis</div>
                  <h2 className="mt-3 font-display text-2xl font-bold tracking-[-0.055em] sm:text-3xl">Test a candidate password</h2>
                </div>
                <span className="flex items-center gap-2 rounded-full border border-emerald-700/20 bg-emerald-50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-800"><ShieldCheck className="h-3.5 w-3.5" /> No network check</span>
              </div>

              <div className="mt-7">
                <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/55" htmlFor="candidate">Candidate password</label>
                <div className="mt-2 flex border border-black/20 bg-white focus-within:border-[#275df5] focus-within:ring-2 focus-within:ring-[#275df5]/20">
                  <input
                    autoComplete="new-password"
                    className="min-w-0 flex-1 bg-transparent px-4 py-4 font-mono text-base tracking-[0.08em] outline-none placeholder:tracking-normal placeholder:text-black/30"
                    id="candidate"
                    maxLength={256}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Type or paste a password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <button aria-label={showPassword ? "Hide password" : "Show password"} className="m-2 grid h-10 w-10 place-items-center border border-black/10 text-black/55 transition hover:border-black/30 hover:text-black" onClick={() => setShowPassword((value) => !value)} type="button">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-black/45"><span>Analyzed in this tab only</span><span>{password.length}/256</span></div>
              </div>

              <div className="mt-8 grid gap-7 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="border-l-4 border-[#275df5] bg-[#151619] p-5 text-white">
                  <div className="flex items-baseline justify-between gap-3"><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">Guessability estimate</span><span className={`font-display text-sm font-bold ${analysis ? analysisMeta.tone : "text-white/35"}`}>{analysis ? analysisMeta.label : "Waiting"}</span></div>
                  <div className="mt-7 flex items-end gap-4"><strong className="font-display text-6xl font-bold tracking-[-0.08em]">{analysis ? analysis.score : "—"}</strong><span className="mb-2 font-mono text-xs text-white/45">/ 4</span></div>
                  <div className="mt-6 grid grid-cols-5 gap-1.5" aria-label="Password strength scale">
                    {strengthScale.map((item, index) => <span className={`h-2.5 ${analysis && index <= analysis.score ? item.rail : "bg-white/15"}`} key={item.label} />)}
                  </div>
                  <p className="mt-5 text-xs leading-5 text-white/60">{analysis ? `Estimated offline slow-hash scenario: ${offlineTime}.` : "Type a password to see patterns, estimates, and suggestions."}</p>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-3"><div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#275df5] text-white"><KeyRound className="h-3.5 w-3.5" /></div><div><p className="font-display text-sm font-bold">Estimated attempts</p><p className="mt-1 font-mono text-sm text-black/65">{analysis ? formatGuesses(analysis.guesses) : "—"}</p></div></div>
                  <div className="flex items-start gap-3"><div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#d8d1bf] text-[#151619]"><TriangleAlert className="h-3.5 w-3.5" /></div><div><p className="font-display text-sm font-bold">Why this result</p><p className="mt-1 text-sm leading-5 text-black/65">{analysis?.feedback.warning || analysis?.feedback.suggestions?.[0] || "The estimator looks for recognizable words, sequences, repeats, names, and keyboard patterns."}</p></div></div>
                </div>
              </div>

              <div className="mt-8 border-t border-black/10 pt-5 font-mono text-[10px] leading-5 tracking-[0.04em] text-black/50">MARGIN NOTE — This is a local guessability estimate, not a proof that a password is secure or a precise entropy calculation.</div>
            </div>

            <aside className="cipher-ink-panel border-l-[5px] border-[#275df5] bg-[#151619] p-5 text-white shadow-[6px_6px_0_#275df5] sm:p-8 sm:shadow-[9px_9px_0_#275df5]" id="principles">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#94b2ff]">Design principles</p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-none tracking-[-0.055em]">Security advice should explain itself.</h2>
              <div className="mt-8 space-y-5 border-t border-white/10 pt-6">
                {[ ["01", "Local by design", "Passwords stay in the active browser tab; Vaultloom has no password-analysis API."], ["02", "Pattern-aware", "The estimate is informed by common passwords, sequences, dates, l33t substitutions, and repeated patterns."], ["03", "Honest feedback", "Results show assumptions and recommendations instead of claiming guaranteed safety."] ].map(([number, title, copy]) => <div className="grid grid-cols-[28px_1fr] gap-3" key={number}><span className="font-mono text-[10px] text-[#78a0ff]">{number}</span><div><p className="font-display text-sm font-bold">{title}</p><p className="mt-1.5 text-xs leading-5 text-white/55">{copy}</p></div></div>)}
              </div>
            </aside>
          </section>

          <section className="cipher-panel mt-10 max-w-6xl border border-l-[5px] border-black/15 border-l-[#275df5] bg-[#f7f4ec] p-4 shadow-[6px_6px_0_#275df5] sm:mt-14 sm:p-8 sm:shadow-[9px_9px_0_#275df5]" id="generate">
            <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="flex flex-wrap items-start justify-between gap-5 border-b border-black/10 pb-6"><div><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#275df5]"><Sparkles className="h-3.5 w-3.5" /> Uniform local generation</div><h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.055em]">Make a password you do not have to invent.</h2></div><button className="flex items-center gap-2 border border-black/15 px-4 py-2 font-display text-sm font-bold transition hover:border-[#275df5] hover:bg-[#275df5] hover:text-white" onClick={generate} type="button"><RefreshCw className="h-4 w-4" /> Regenerate</button></div>
                <div className="mt-7 border border-black/20 bg-white p-4 sm:p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><code className="max-w-full break-all font-mono text-base tracking-[0.07em] text-[#151619] sm:text-2xl sm:tracking-[0.1em]">{generatedPassword}</code><button className="flex shrink-0 items-center justify-center gap-2 bg-[#151619] px-4 py-3 font-display text-sm font-bold text-white transition hover:bg-[#275df5]" onClick={copy} type="button">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Copied" : "Copy"}</button></div></div>
                <div className="mt-7 grid gap-6 md:grid-cols-[1fr_1fr]"><div><div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-black/55"><span>Length</span><span className="text-[#275df5]">{length} characters</span></div><input aria-label="Generated password length" className="mt-4 w-full accent-[#275df5]" max="64" min="12" onChange={(event) => setLength(Number(event.target.value))} step="1" type="range" value={length} /><div className="mt-2 flex justify-between font-mono text-[10px] text-black/40"><span>12</span><span>64</span></div></div><div className="grid grid-cols-2 gap-2">{(Object.keys(enabled) as CharacterSet[]).map((key) => <button className={`border px-3 py-3 text-left font-mono text-[10px] uppercase tracking-[0.1em] transition ${enabled[key] ? "border-[#275df5] bg-[#e8eeff] text-[#1747ca]" : "border-black/15 bg-white text-black/40 hover:border-black/40"}`} key={key} onClick={() => setEnabled((state) => ({ ...state, [key]: !state[key] }))} type="button"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-current" />{key}</button>)}</div></div>
                <p className="mt-6 font-mono text-[10px] leading-5 tracking-[0.04em] text-black/50">GENERATOR NOTE — Uses Web Crypto and rejection sampling so each selected character index is uniformly mapped. Ambiguous glyphs are excluded to reduce transcription mistakes.</p>
              </div>
              <div className="relative min-h-[280px] overflow-hidden bg-[#0f1216] p-6 text-white sm:p-8"><div className="cipher-generator-field absolute inset-0" /><div className="relative flex h-full flex-col justify-between"><div><span className="inline-flex items-center gap-2 border border-white/20 bg-black/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#b9ccff]"><Clipboard className="h-3.5 w-3.5" /> Generator protocol</span><h3 className="mt-5 max-w-sm font-display text-3xl font-bold leading-none tracking-[-0.055em]">A deliberate alternative to familiar, predictable choices.</h3></div><div className="border-t border-white/20 pt-5"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">Selected families</p><p className="mt-2 font-display text-sm font-bold text-white">{activeSets.length ? activeSets.join(" · ") : "No families selected"}</p></div></div></div>
            </div>
          </section>
        </div>

        <footer className="cipher-footer border-l-8 border-l-[#275df5] bg-[#151619] px-4 py-8 sm:px-10 lg:px-14"><div className="mx-auto grid max-w-6xl gap-6 border-t border-white/10 pt-7 md:grid-cols-[1.2fr_0.8fr] md:items-end"><p className="max-w-xl text-xs leading-5 text-white/45">Vaultloom is a local educational workbench maintained by Aurelius. Use a password manager, unique passwords for every account, and multi-factor authentication for meaningful account protection.</p><div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#94b2ff]"><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div><div className="mx-auto mt-6 flex max-w-6xl flex-col gap-3 border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-4 sm:tracking-[0.16em]"><span>© 2026 Aurelius · Vaultloom</span><span>No accounts · No analytics · No password storage</span></div></footer>
      </main>
    </div>
  );
}
