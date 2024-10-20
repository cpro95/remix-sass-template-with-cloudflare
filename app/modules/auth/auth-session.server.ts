import { createCookieSessionStorage } from "@remix-run/cloudflare";

export const AUTH_SESSION_KEY = "_mypoplyrics_auth";
export const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: AUTH_SESSION_KEY,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secrets: [import.meta.env.SESSION_SECRET || "NOT_A_STRONG_SECRET4398754927349213"],
    secure: import.meta.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = authSessionStorage;
