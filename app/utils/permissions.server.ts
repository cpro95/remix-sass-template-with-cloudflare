/**
 * Permissions and Roles.
 * Implementation based on github.com/epicweb-dev/epic-stack
 */
import { json } from "@remix-run/cloudflare";
import { requireUser } from "~/modules/auth/auth.server";
import { userHasRole } from "~/utils/misc";
import { ROUTE_PATH as LOGIN_PATH } from "~/routes/auth+/login";

export type RoleName = "user" | "admin";

export async function requireUserWithRole(request: Request, name: RoleName) {
  const user = await requireUser(request, { redirectTo: LOGIN_PATH });
  const hasRole = userHasRole(user, name);
  if (!hasRole) {
    throw json(
      {
        error: "Unauthorized",
        requiredRole: name,
        message: `Unauthorized: required role: ${name}`,
      },
      { status: 403 }
    );
  }
  return user;
}
