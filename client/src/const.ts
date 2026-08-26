export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/** Starts same-origin GitHub OAuth for protected vulnerability reporting. */
export const startLogin = () => {
  const returnTo = `${window.location.pathname}${window.location.search}`;
  window.location.assign(
    `/api/auth/github/login?returnTo=${encodeURIComponent(returnTo)}`
  );
};
