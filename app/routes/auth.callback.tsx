import { LoaderFunction, redirect } from "@remix-run/node";
import { authApi } from "~/utils/api.server";
import { createUserSession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const isNewUser = url.searchParams.get("is_new_user") === "true";

  if (status === "success") {
    // Создаем сессию для пользователя
    return createUserSession("temp-user-id", "/dashboard");
  }

  return redirect("/login");
};

export default function Callback() {
  return null;
} 