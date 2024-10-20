import { json, redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Outlet, useLoaderData } from "@remix-run/react";

import { requireUser } from "~/modules/auth/auth.server";
// import { prisma } from "~/utils/db.server";
// import { ROUTE_PATH as ONBOARDING_USERNAME_PATH } from "~/routes/onboarding+/username";
import { Navigation } from "~/components/navigation";
// import { Header } from "~/components/header";

export const ROUTE_PATH = "/dashboard" as const;

const ONBOARDING_USERNAME_PATH = "/";
// const ONBOARDING_USERNAME_PATH = "/onboarding/username";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  if (!user.username) return redirect(ONBOARDING_USERNAME_PATH);
  //   const subscription = await prisma.subscription.findUnique({
  //     where: { userId: user.id },
  //   });

  //   return json({ user, subscription } as const);
  return json({ user } as const);
}

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex min-h-[100vh] w-full flex-col bg-secondary dark:bg-black">
      <Navigation user={user} />
      {/* <Header /> */}
      <Outlet />
    </div>
  );
}
