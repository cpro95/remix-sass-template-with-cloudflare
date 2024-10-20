import { json } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";

export const ROUTE_PATH = "/" as const;

export async function loader() {
  return json({});
}

export default function Home() {
  return <Outlet />;
}
