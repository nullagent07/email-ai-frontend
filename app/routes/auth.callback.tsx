import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { handleCallback } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  // const code = url.searchParams.get("code");
  // const state = url.searchParams.get("state");

  // console.log(request);

  // if (!code || !state) {
  //   return redirect("/login");
  // }

  try {
    // const response = await handleCallback(code, state, request);
    
    // Получаем куки из ответа бэкенда
    const cookie = request.headers?.get('cookie');
    const accessToken = cookie?.split(';').find(c => c.trim().startsWith('access_token'));
    if (!accessToken) {
      return redirect("/login");
    }

    return redirect("/dashboard", {
      headers: cookie ? {
        'Set-Cookie': cookie
      } : undefined
    });
  } catch (error) {
    console.error("Auth callback error:", error);
    return redirect("/login?error=auth_failed");
  }
}

export default function Callback() {
  return <div>Processing authentication...</div>;
}