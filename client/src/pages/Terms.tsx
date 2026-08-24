/* Cipher Atelier: concise educational-use terms. */
import PublicPage from "@/components/PublicPage";

const terms = [
  ["Educational tool", "Vaultloom provides local password-generation and guessability feedback for educational and personal-use purposes. It does not guarantee that any password is secure or suitable for a particular service."],
  ["Your responsibility", "You are responsible for deciding where and whether to use a generated password. Use unique passwords, a trusted password manager, and multi-factor authentication when a service offers it."],
  ["No sensitive submissions", "Do not use the support route to submit real passwords, recovery codes, private keys, authentication tokens, or personal data."],
  ["Availability and changes", "The project may change, pause, or be removed without notice. Features, dependencies, privacy practices, and this page may be updated as the product evolves."],
  ["Open-source code", "The source code is made available under the repository license. Third-party libraries retain their own licenses and notices."],
] as const;

export default function Terms() {
  return <PublicPage eyebrow="Terms of use" ledger="Record 05" title="Useful guidance, not a security guarantee." lede="These terms set expectations for the Vaultloom workbench. Last updated August 25, 2026.">
    <div className="max-w-3xl divide-y divide-black/10 border-y border-black/10">{terms.map(([title, copy], index) => <article className="grid gap-3 py-6 sm:grid-cols-[120px_1fr]" key={title}><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#275df5]">{String(index + 1).padStart(2, "0")}</span><div><h2 className="font-display text-lg font-bold">{title}</h2><p className="mt-2 text-sm leading-7 text-black/70">{copy}</p></div></article>)}</div>
  </PublicPage>;
}
