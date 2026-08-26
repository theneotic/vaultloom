# Vaultloom — Design Direction

## Three initial directions

### 1. Cipher Atelier

**Very Brief Intro:** An editorial security workbench with ink-black surfaces, cold blue signal accents, and the precision of a cryptography lab notebook. It makes password quality feel understandable rather than intimidating.

**Probability:** 0.07

### 2. Safety Signal

**Very Brief Intro:** A calm, contemporary wellness-inspired interface that reframes digital security as a repeatable personal habit. Soft mineral tones and gentle data cues make the product approachable.

**Probability:** 0.04

### 3. Terminal Reliquary

**Very Brief Intro:** A high-contrast, typographic system inspired by archival terminals and forensic reports. It is deliberately severe, dense, and utilitarian.

**Probability:** 0.09

## Chosen direction: Cipher Atelier

### Design Movement

**Contemporary editorial systems design** informed by Swiss information graphics and technical field notebooks. The interface should feel like a careful piece of security instrumentation, not a generic SaaS dashboard.

### Core Principles

1. **Trust through legibility:** Every visual decision clarifies the status of a password or the reason for a recommendation.
2. **Measured tension:** Dark surfaces are balanced by warm paper-toned content areas so the product remains calm and not cyberpunk.
3. **Evidence-first hierarchy:** Scores, assumptions, and user choices are explicit; no visual element claims certainty the tool cannot provide.
4. **Tactile precision:** Hairline grids, ruled dividers, monospaced annotations, and restrained motion suggest deliberate engineering.

### Color Philosophy

The base is **deep ink** to establish focus and privacy. A warm parchment content field creates breathing room and avoids the sterile feel of pure white. **Signal blue** is the ownable color: it marks active controls, verified local processing, and healthy outcomes without relying on green-only status language. Amber and muted vermilion appear only when the analyzer needs caution.

### Layout Paradigm

A **split instrument panel**. The left rail is a permanent, compact security ledger: local-processing status, mode switcher, and product principles. The right surface is an oversized working paper where analyzer and generator modules occupy broad, asymmetric horizontal bands—not stacks of uniform cards.

### Signature Elements

1. **Signal rail:** A cobalt vertical index with a moving state marker and compact local-only label.
2. **Confidence spectrum:** A thin segmented score line with calibrated labels rather than a generic circular progress bar.
3. **Margin notes:** Monospaced implementation notes that explain what is being measured and what the score does not prove.

### Interaction Philosophy

Controls feel precise and reversible. Typing produces debounced feedback; copying a generated password provides a short, explicit confirmation. Every disclosure control states why it exists. Keyboard interaction is immediate; only consequential state changes receive motion.

### Animation

Use 140–220ms transform/opacity transitions with a crisp ease-out. The score line may settle into its new value after analysis completes; recommendations can stagger in by 45ms. Respect `prefers-reduced-motion` and never use motion to hide a warning or delay keyboard users.

### Typography System

Use **Space Grotesk** for display headlines and controls, paired with **IBM Plex Mono** for measurements, status metadata, and code-like annotations. Headlines are bold and compact; explanatory copy is moderate-weight and generous in line-height. The UI must not use Inter as its primary face.

### Brand Essence

**Vaultloom is a privacy-first password workbench for people who want practical security evidence without handing their secrets to a service.**

**Personality:** lucid, disciplined, reassuring.

### Brand Voice

Headlines are direct, specific, and modest about certainty. CTAs describe the action and its privacy boundary.

Examples:

- “Measure guessability. Keep the secret here.”
- “Generate a password with uniform local randomness.”

### Wordmark & Logo

The mark is a **three-bar vault glyph**: a cobalt vertical keyline crossed by two offset notches, suggesting a protected keyway and a strength meter. The wordmark uses a modified Space Grotesk treatment with a bracketed `VAULT/LOOM` construction, never a default-font label.

### Signature Brand Color

**Signal Blue — #275DF5**

## Style Decisions

- Avoid generic glowing shields, neon hacker motifs, purple gradients, and uniform rounded-card grids.
- The visual focus is on clear evidence, local-processing transparency, and password quality—not fear.
- Maintain the deep-ink / parchment / signal-blue palette throughout the implementation.
- Physical imagery avoids literal keys, locks, shields, and hacker tropes; macro forensic hardware, calibrated instruments, paper records, and security-lab surfaces are the recurring visual world.
- The cobalt signal rail is structural: it carries local-processing status, active mode/state, or indexed evidence whenever a major work area begins.
- The Vaultloom identity appears above the fold as the three-bar vault glyph plus bracketed `[VAULT/LOOM]` wordmark.
- Each cobalt signal rail is a live ledger: its adjacent label identifies the current work area, page record, or local-processing boundary.
- Secondary pages favor numbered field-report rows and ruled evidence bands over floating benefits cards.
