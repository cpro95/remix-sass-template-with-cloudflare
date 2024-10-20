import { useEffect, useState } from "react";
import {
  json,
  type MetaFunction,
  type LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import { LogOut } from "lucide-react";
import { authenticator } from "~/modules/auth/auth.server";
import { cn } from "~/utils/misc";
import { useTheme } from "~/utils/hooks/use-theme.js";
import { siteConfig } from "~/utils/constants/brand";
import { ROUTE_PATH as LOGIN_PATH } from "~/routes/auth+/login";
import { ROUTE_PATH as LOGOUT_PATH } from "~/routes/auth+/logout";
import { Button, buttonVariants } from "~/components/ui/button";
import { ThemeSwitcherHome } from "~/components/misc/theme-switcher";

import ShadowPNG from "/assets/shadow.png";
import { Logo } from "~/components/logo";
import { Footer } from "~/components/footer";

export const meta: MetaFunction = () => {
  return [{ title: `${siteConfig.siteTitle} - Starter Kit` }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request);
  return json({ user: sessionUser } as const);
  // return json({
  //   user: {
  //     id: "1",
  //     email: "test@test.com",
  //     username: "test",
  //     image: "/assets/logo-light.png",
  //     customerId: "null",
  //     subscription: "null",
  //     roles: "user",
  //   },
  // } as const);
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  console.log(user);
  const theme = useTheme();
  const submit = useSubmit();

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
      {/* Navigation */}
      <nav
        className={cn(
          "sticky top-0 z-50 mx-auto flex w-full max-w-screen-lg items-center justify-between p-6 py-3",
          hasScrolled
            ? "top-1.5 rounded-full bg-white/20 backdrop-blur transition-all duration-300 dark:bg-secondary/20"
            : "bg-transparent transition-all duration-300"
        )}
      >
        <Link to="/" prefetch="intent" className="flex h-10 items-center gap-1">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <ThemeSwitcherHome />
          <Link
            to={LOGIN_PATH}
            className={cn(buttonVariants({ size: "sm" }), "h-8")}
          >
            {user ? "Dashboard" : "Log in"}
          </Link>

          {user && (
            <Button
              variant="ghost"
              className="group h-9 w-full cursor-pointer justify-between rounded-md px-2"
              onClick={() =>
                submit({}, { action: LOGOUT_PATH, method: "POST" })
              }
            >
              <span className="text-sm text-primary/60 group-hover:text-primary group-focus:text-primary mr-2">
                Log Out
              </span>
              <LogOut className="h-[18px] w-[18px] stroke-[1.5px] text-primary/60 group-hover:text-primary group-focus:text-primary" />
            </Button>
          )}
        </div>
      </nav>

      {/* Content */}
      <div className="z-10 mx-auto flex w-full max-w-screen-lg flex-col gap-4 px-6">
        <div className="z-10 flex h-full w-full flex-col items-center justify-center gap-4 p-12 md:p-24">
          <Button
            variant="outline"
            className={cn(
              "hidden h-8 rounded-full bg-white/60 px-3 text-sm font-bold ring-1 ring-primary/10 backdrop-blur transition hover:text-primary hover:brightness-110 dark:bg-secondary md:flex"
            )}
          >
            {siteConfig.siteTitle}
          </Button>
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
        </div>

        <div className="relative z-10 flex flex-col border border-border backdrop-blur-sm lg:flex-row">
          <div className="flex w-full flex-col items-start justify-center gap-6 border-r border-primary/10 p-10 lg:p-12">
            <p className="h-14 text-lg text-primary/60">
              <span className="font-semibold text-primary">
                Production Ready.
              </span>{" "}
              Build your app on a solid, scalable, well-tested foundation.
            </p>
            <Link to={LOGIN_PATH} className={buttonVariants({ size: "sm" })}>
              Get Started
            </Link>
          </div>
          <div className="flex w-full flex-col items-start justify-center gap-6 p-10 lg:w-[60%] lg:border-b-0 lg:p-12">
            <p className="h-14 text-lg text-primary/60">
              <span className="font-semibold text-primary">Ready to Ship.</span>{" "}
              Deployments ready with a single command.
            </p>
            <a
              href="https://github.com/dev-xo/remix-saas/tree/main/docs#welcome-to-%EF%B8%8F-remix-saas-documentations"
              target="_blank"
              rel="noreferrer"
              className={cn(
                `${buttonVariants({
                  variant: "outline",
                  size: "sm",
                })} dark:bg-secondary dark:hover:opacity-80`
              )}
            >
              Explore Documentation
            </a>
          </div>

          <div className="absolute left-0 top-0 z-10 flex flex-col items-center justify-center">
            <span className="absolute h-6 w-[1px] bg-primary/40" />
            <span className="absolute h-[1px] w-6 bg-primary/40" />
          </div>
          <div className="absolute bottom-0 right-0 z-10 flex flex-col items-center justify-center">
            <span className="absolute h-6 w-[1px] bg-primary/40" />
            <span className="absolute h-[1px] w-6 bg-primary/40" />
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
