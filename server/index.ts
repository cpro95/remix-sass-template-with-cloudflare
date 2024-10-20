import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

const route = app.get("/test", async (c) => {
  return c.text(`hono is good`);
});

export default app;

export type AppType = typeof route;
