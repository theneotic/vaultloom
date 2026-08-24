# Backend integration boundary

SlaySecure Pro performs generation and strength feedback in the browser for privacy and responsiveness. An authentication backend must still treat every submitted password as untrusted input and enforce its own policy.

1. Re-run the same `zxcvbn-ts` policy during registration and password changes; never trust a browser score.
2. Use TLS and request-size limits. Reject overly long passwords rather than silently truncating what will be stored.
3. Hash accepted passwords with Argon2id; store only the hash and never log password-bearing request bodies.
4. Run zxcvbn scoring on registration and change-password routes, not on every login verification. Login should verify the stored Argon2id hash and be rate-limited.
5. If high signup concurrency is required, move synchronous scoring to bounded worker threads or a separately scaled service.

This static repository deliberately contains no server-side authentication implementation or secrets.
