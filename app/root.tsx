import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { AuthenticityTokenProvider } from "remix-utils/csrf/react";
import { Toaster } from "./components/ui/sonner";
import { getTheme, Theme, useTheme } from "./utils/hooks/use-theme";
import { ClientHintCheck } from "./components/misc/client-hints";
import { useNonce } from "./utils/hooks/use-nonce";
import { GenericErrorBoundary } from "./components/misc/error-boundary";
import { siteConfig } from "./utils/constants/brand";
import { getToastSession } from "./utils/toast.server";
import { csrf } from "./utils/csrf.server";
import { getHints } from "./utils/hooks/use-hints";
import { combineHeaders, getDomainUrl } from "./utils/misc.server";
import { useToast } from "./components/toaster";
import { authenticator } from "./modules/auth/auth.server";

import RootCSS from "./tailwind.css?url";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data
        ? `${siteConfig.siteTitle}`
        : `Error | ${siteConfig.siteTitle}`,
    },
    {
      name: "description",
      content: siteConfig.siteDescription,
    },
  ];
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: RootCSS }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request);
  const user = sessionUser
    ? {
        id: "1",
        email: "test@test.com",
        username: "test",
        image: "/assets/logo-light.png",
        customerId: "null",
        subscription: "null",
        roles: "user",
      }
    : null;

  const { toast, headers: toastHeaders } = await getToastSession(request);
  const [csrfToken, csrfCookieHeader] = await csrf.commitToken();

  return json(
    {
      user,
      toast,
      csrfToken,
      requestInfo: {
        hints: getHints(request),
        origin: getDomainUrl(request),
        path: new URL(request.url).pathname,
        userPrefs: { theme: getTheme(request) },
      },
    } as const,
    {
      headers: combineHeaders(
        toastHeaders,
        csrfCookieHeader ? { "Set-Cookie": csrfCookieHeader } : null
      ),
    }
  );
}

function Document({
  children,
  nonce,
  lang = "en",
  dir = "ltr",
  theme = "light",
}: {
  children: React.ReactNode;
  nonce: string;
  lang?: string;
  dir?: "ltr" | "rtl";
  theme?: Theme;
}) {
  return (
    <html
      lang={lang}
      dir={dir}
      className={`${theme} overflow-x-hidden`}
      style={{ colorScheme: theme }}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ClientHintCheck nonce={nonce} />
        <Meta />
        <Links />
      </head>
      <body className="h-auto w-full">
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <Toaster closeButton position="bottom-center" theme={theme} />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const { toast, csrfToken } = useLoaderData<typeof loader>();

  const nonce = useNonce();
  const theme = useTheme();

  // Renders toast (if any).
  useToast(toast);

  return (
    <Document nonce={nonce} theme={theme} lang="en">
      <AuthenticityTokenProvider token={csrfToken}>
        <Outlet />
      </AuthenticityTokenProvider>
    </Document>
  );
}

export function ErrorBoundary() {
  const nonce = useNonce();
  const theme = useTheme();

  return (
    <Document nonce={nonce} theme={theme}>
      <GenericErrorBoundary
        statusHandlers={{
          403: ({ error }) => (
            <p>You are not allowed to do that: {error?.data.message}</p>
          ),
        }}
      />
    </Document>
  );
}
