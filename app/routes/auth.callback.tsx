import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { handleCallback } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return redirect("/login");
  }

  try {
    const token = await handleCallback(code, state, request);
    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": `access_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`,
      },
    });
  } catch (error) {
    console.error("Auth callback error:", error);
    return redirect("/login?error=auth_failed");
  }
}

export default function Callback() {
  return <div>Processing authentication...</div>;
}