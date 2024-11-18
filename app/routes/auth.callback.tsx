import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getAuthService } from "../services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return redirect("/login");
  }

  try {
    const authService = await getAuthService();
    const token = await authService.handleCallback(code, state);
    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": `token=${token}; Path=/; HttpOnly`,
      },
    });
  } catch (error) {
    console.error("Auth callback error:", error);
    return redirect("/login");
  }
}

export default function Callback() {
  return <div>Processing authentication...</div>;
}