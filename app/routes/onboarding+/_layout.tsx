import { json, redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";

import { requireUser } from "~/modules/auth/auth.server";
import { getDomainPathname } from "~/utils/misc.server";
import { ROUTE_PATH as DASHBOARD_PATH } from "~/routes/dashboard+/_layout";
import { ROUTE_PATH as ONBOARDING_USERNAME_PATH } from "~/routes/onboarding+/username";
import { Logo } from "~/components/logo";

export const ROUTE_PATH = "/onboarding" as const;

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  const pathname = getDomainPathname(request);
  console.log(pathname);
  const isOnboardingPathname = pathname === ROUTE_PATH;
  const isOnboardingUsernamePathname = pathname === ONBOARDING_USERNAME_PATH;

  if (isOnboardingPathname) return redirect(DASHBOARD_PATH);
  if (user.username && isOnboardingUsernamePathname)
    return redirect(DASHBOARD_PATH);

  return json({});
}

export default function Onboarding() {
  return (
    <div className="relative flex h-screen w-full bg-card">
      <div className="absolute left-1/2 top-8 mx-auto -translate-x-1/2 transform justify-center">
        <Logo />
      </div>
      <div className="z-10 h-screen w-screen">
        <Outlet />
      </div>
      <div className="base-grid fixed h-screen w-screen opacity-40" />
      <div className="fixed bottom-0 h-screen w-screen bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
    </div>
  );
}
