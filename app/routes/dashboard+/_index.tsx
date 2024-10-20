import { useEffect, useState } from "react";
import {
  json,
  type MetaFunction,
  type LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { authenticator } from "~/modules/auth/auth.server";
import { cn } from "~/utils/misc";
import { useTheme } from "~/utils/hooks/use-theme.js";
import { siteConfig } from "~/utils/constants/brand";
import { buttonVariants } from "~/components/ui/button";
import ShadowPNG from "/assets/shadow.png";
import { Footer } from "~/components/footer";

export const meta: MetaFunction = () => {
  return [{ title: `${siteConfig.siteTitle} - Starter Kit` }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request);
  console.log("sessionUser in dashboard");
  console.log(sessionUser);
  return json({ user: sessionUser } as const);
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  const theme = useTheme();

  // UI - Handle Scroll
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col bg-card">
      {/* Content */}
      <div className="z-10 mx-auto flex w-full max-w-screen-lg flex-col gap-4 px-6">
        <div className="z-10 flex h-full w-full flex-col items-center justify-center gap-4 p-12 md:p-24">
          <h1 className="text-center text-6xl font-bold leading-tight text-primary md:text-7xl lg:leading-tight">
            Production Ready
            <br />
            SaaS Stack for Remix
          </h1>
          <p className="max-w-screen-md text-center text-lg !leading-normal text-muted-foreground md:text-xl">
            Launch in days with a modern{" "}
            <span className="font-medium text-primary">
              Production-Ready Stack
            </span>
            <br className="hidden lg:inline-block" /> Stripe integration.
            Vite-powered. Open Source.
          </p>
          <div className="mt-2 flex w-full items-center justify-center gap-2">
            <a
              href="https://github.com/dev-xo/remix-saas/tree/main/docs#welcome-to-%EF%B8%8F-remix-saas-documentation"
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "hidden dark:bg-secondary dark:hover:opacity-80 sm:flex"
              )}
            >
              Explore Documentation
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Background */}
      <img
        src={ShadowPNG}
        alt="Hero"
        className={`fixed left-0 top-0 z-0 h-full w-full opacity-60 ${
          theme === "dark" ? "invert" : ""
        }`}
      />
      <div className="base-grid fixed h-screen w-screen opacity-40" />
      <div className="fixed bottom-0 h-screen w-screen bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
    </div>
  );
}
