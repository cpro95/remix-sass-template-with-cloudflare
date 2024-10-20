/**
 * Learn more about CSRF protection:
 * @see https://github.com/sergiodxa/remix-utils?tab=readme-ov-file#csrf
 */

import { createCookie } from "@remix-run/cloudflare";
import { CSRF, CSRFError } from "remix-utils/csrf/server";

export const CSRF_COOKIE_KEY = "_csrf";

const cookie = createCookie(CSRF_COOKIE_KEY, {
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secrets: [import.meta.SESSION_SECRET || "NOT_A_STRONG_SECRET"],
  secure: import.meta.NODE_ENV === "production",
});

export const csrf = new CSRF({ cookie });

export async function validateCSRF(formData: FormData, headers: Headers) {
  try {
    await csrf.validate(formData, headers);
  } catch (err: unknown) {
    if (err instanceof CSRFError) {
      throw new Response("Invalid CSRF token", { status: 403 });
    }
    throw err;
  }
}
