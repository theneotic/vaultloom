# Vaultloom

> **A privacy-first password workbench that generates credentials locally and estimates guessability in the active browser tab.**

| Project lens | Details |
| --- | --- |
| **Type** | Web application |
| **Stack** | TypeScript · React · Vite |
| **Status** | Actively maintained |

## Overview

A privacy-first password workbench that generates credentials locally and estimates guessability in the active browser tab. This README keeps the project’s verified setup, usage, privacy, and implementation notes together in one place.

## Repository Snapshot

The top-level workspace currently includes `Dockerfile`, `LICENSE`, `README.md`, `api/`, `client/`, `components.json`, `docs/`, `drizzle/`, `drizzle.config.ts`, `ideas.md`, `package.json`, `patches/`. Review the project-specific sections below before installing dependencies, supplying configuration values, or running a build.


---

> **Measure guessability. Keep the secret here.**

Vaultloom is a privacy-first password workbench. It generates passwords locally with the browser Web Crypto API and rejection sampling, then estimates password guessability with `zxcvbn-ts` in the active tab. The project deliberately contains no password-analysis API, telemetry, or browser storage for password work.

## What is improved

| Capability | Vaultloom behavior |
|---|---|
| Randomness | Uses `crypto.getRandomValues` and rejection sampling rather than modulo reduction alone. |
| Generation | Guarantees every selected character family while excluding ambiguous glyphs. |
| Analysis | Uses `zxcvbn-ts` to recognize common passwords, sequences, repeated patterns, keyboard walks, l33t substitutions, and dictionary-like terms. |
| Privacy | Keeps candidate and generated passwords in React memory only; no requests are made to analyze them. |
| Security language | Calls the output a guessability estimate, not a guarantee or literal entropy measurement. |
| Quality controls | Includes Vitest checks for rejection sampling, generator invariants, and relative scorer behavior. |

## Local development

```bash
pnpm install
pnpm dev
```

Run checks before committing:

```bash
pnpm exec vitest run
pnpm build
```

## Public site foundations

The workbench includes a visible project identity and focused public navigation for the product, About, Contact, Privacy, and Terms pages. The footer repeats the support route, legal links, ownership notice, and copyright.

Search is intentionally not included: the application has one interactive workbench and four short informational pages, so a global search index would not provide meaningful navigation value. The project also does not invent testimonials, ratings, customer logos, or reviews. Its trust signals are the local-only implementation boundary, the open source link, readable legal notices, and reproducible tests.

## Docker

```bash
docker build -t vaultloom:local .
docker run --rm --init -p 3000:3000 vaultloom:local
```

## Backend boundary

This project is intentionally browser-only. If it is paired with an authentication service, the backend must independently re-check password policy, use TLS and rate limiting, store only Argon2id hashes, and never trust a client-side score. See [`docs/backend-integration.md`](docs/backend-integration.md).

## Security notes

The interface is educational feedback, not a replacement for a password manager, unique passwords, multi-factor authentication, breach monitoring, or a server-side password policy. The generator’s local-only behavior does not protect against a compromised browser, malicious extension, screen recording, or clipboard manager.

## License

MIT
