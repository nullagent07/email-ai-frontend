import { LoaderFunction, redirect } from "@remix-run/node";
import { authApiServer } from "~/utils/api.server";
import { createUserSession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return redirect("/login");
  }

  try {
    const cookieHeader = request.headers.get("Cookie");
    const response = await authApiServer.googleCallback(
      code,
      state,
      { "Cookie": cookieHeader }
    );

    const { access_token, user_id } = response.data;
    
    // Создаем сессию пользователя
    return createUserSession(user_id, "/dashboard");
  } catch (error) {
    console.error("Ошибка при обработке callback:", error);
    return redirect("/login");
  }
};

export default function Callback() {
  return null;
}