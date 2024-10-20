import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/cloudflare";
import { Form, useLoaderData, useActionData } from "@remix-run/react";

import { z } from "zod";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { requireUser } from "~/modules/auth/auth.server";
import { getSession, destroySession } from "~/modules/auth/auth-session.server";
import { createToastHeaders } from "~/utils/toast.server";
import { useDoubleCheck } from "~/utils/hooks/use-double-check";
import { ERRORS } from "~/utils/constants/errors";
import { INTENTS } from "~/utils/constants/misc";
import { ROUTE_PATH as HOME_PATH } from "~/routes/_home+/_layout";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export const UsernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .toLowerCase()
    .trim()
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Username may only contain alphanumeric characters."
    ),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  return json({ user });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.clone().formData();
  const intent = formData.get(INTENTS.INTENT);

  if (intent === INTENTS.USER_UPDATE_USERNAME) {
    const submission = parseWithZod(formData, { schema: UsernameSchema });
    if (submission.status !== "success") {
      return json(submission.reply(), {
        status: submission.status === "error" ? 400 : 200,
      });
    }

    const { username } = submission.value;
    const isUsernameTaken = null;
    // const isUsernameTaken = await prisma.user.findUnique({
    //   where: { username },
    // });

    if (isUsernameTaken) {
      return json(
        submission.reply({
          fieldErrors: {
            username: [ERRORS.ONBOARDING_USERNAME_ALREADY_EXISTS],
          },
        })
      );
    }

    // await prisma.user.update({ where: { id: user.id }, data: { username } });

    return json(submission.reply({ fieldErrors: {} }), {
      headers: await createToastHeaders({
        title: "Success!",
        description: "Username updated successfully.",
      }),
    });
  }

  if (intent === INTENTS.USER_DELETE_ACCOUNT) {
    // await prisma.user.delete({ where: { id: user.id } });

    return redirect(HOME_PATH, {
      headers: {
        "Set-Cookie": await destroySession(
          await getSession(request.headers.get("Cookie"))
        ),
      },
    });
  }

  throw new Error(`Invalid intent: ${intent}`);
}

export default function DashboardSettings() {
  const { user } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();

  const { doubleCheck, getButtonProps } = useDoubleCheck();

  const [form, { username }] = useForm({
    lastResult,
    constraint: getZodConstraint(UsernameSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UsernameSchema });
    },
  });

  return (
    <div className="flex h-full w-full flex-col gap-6">
      {/* Username */}
      <Form
        method="POST"
        className="flex w-full flex-col items-start rounded-lg border border-border bg-card"
        {...getFormProps(form)}
      >
        <div className="flex w-full flex-col gap-4 rounded-lg p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-medium text-primary">Your Username</h2>
            <p className="text-sm font-normal text-primary/60">
              This is your username. It will be displayed on your profile.
            </p>
          </div>
          <Input
            placeholder="Username"
            autoComplete="off"
            defaultValue={user?.username ?? ""}
            required
            className={`w-80 bg-transparent ${
              username.errors &&
              "border-destructive focus-visible:ring-destructive"
            }`}
            {...getInputProps(username, { type: "text" })}
          />
          {username.errors && (
            <p className="text-sm text-destructive dark:text-destructive-foreground">
              {username.errors.join(" ")}
            </p>
          )}
        </div>
        <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 dark:bg-card">
          <p className="text-sm font-normal text-primary/60">
            Please use 32 characters at maximum.
          </p>
          <Button
            type="submit"
            size="sm"
            name={INTENTS.INTENT}
            value={INTENTS.USER_UPDATE_USERNAME}
          >
            Save
          </Button>
        </div>
      </Form>

      {/* Delete Account */}
      <div className="flex w-full flex-col items-start rounded-lg border border-destructive bg-card">
        <div className="flex flex-col gap-2 p-6">
          <h2 className="text-xl font-medium text-primary">Delete Account</h2>
          <p className="text-sm font-normal text-primary/60">
            Permanently delete your Remix SaaS account, all of your projects,
            links and their respective stats.
          </p>
        </div>
        <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-red-500/10 px-6 dark:bg-red-500/10">
          <p className="text-sm font-normal text-primary/60">
            This action cannot be undone, proceed with caution.
          </p>
          <Form method="POST">
            <Button
              type="submit"
              size="sm"
              variant="destructive"
              name={INTENTS.INTENT}
              value={INTENTS.USER_DELETE_ACCOUNT}
              {...getButtonProps()}
            >
              {doubleCheck ? "Are you sure?" : "Delete Account"}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
