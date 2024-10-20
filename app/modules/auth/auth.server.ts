import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
// import { HOST_URL } from "~/utils/misc.server";
import { ERRORS } from "~/utils/constants/errors";
import { redirect } from "@remix-run/cloudflare";
import { authSessionStorage } from "./auth-session.server";
import { ROUTE_PATH as LOGOUT_PATH } from "~/routes/auth+/logout";

export interface UserType {
  id: string;
  email: string;
  username?: string;
  image?: string;
  customerId?: string;
  subscription?: string;
  roles: string;
}

export const authenticator = new Authenticator<UserType>(authSessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get("email") as string;
    let password = form.get("password") as string;
    let user = await login(email, password);
    if (!user) throw new Error(ERRORS.AUTH_USER_NOT_CREATED);
    return user;
  }),
  "user-pass"
);

async function login(email: string, password: string) {
  if (password !== "1111") {
    return null;
  }
  return {
    id: "1",
    email,
    username: email,
    roles: "admin",
    image: "/assets/logo-dark.png",
  } satisfies UserType;
}

export async function signup(email: string, password: string) {
  if (password !== "1111") {
    return null;
  }
  return {
    id: "1",
    email,
    username: email,
    roles: "admin",
    image: "/assets/logo-light.png",
  } satisfies UserType;
}
/**
 * Utilities.
 */
export async function requireSessionUser(
  request: Request,
  { redirectTo }: { redirectTo?: string | null } = {}
) {
  const sessionUser = await authenticator.isAuthenticated(request);
  if (!sessionUser) {
    if (!redirectTo) throw redirect(LOGOUT_PATH);
    else throw redirect(redirectTo);
  }
  return sessionUser;
}

export async function requireUser(
  request: Request,
  { redirectTo }: { redirectTo?: string | null } = {}
) {
  const sessionUser = await authenticator.isAuthenticated(request);
  // const user = sessionUser?.id
  //   ? await prisma.user.findUnique({
  //       where: { id: sessionUser?.id },
  //       include: {
  //         image: { select: { id: true } },
  //         roles: { select: { name: true } },
  //       },
  //     })
  //   : null;
  const user = sessionUser ? sessionUser : null;
  if (!user) {
    if (!redirectTo) throw redirect(LOGOUT_PATH);
    else throw redirect(redirectTo);
  }
  return user;
}
