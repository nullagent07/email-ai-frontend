import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import LoginPage from "~/components/LoginPage";
import { authApi } from "~/utils/api.server";
import { getUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  
  // Если пользователь уже авторизован, перенаправляем на dashboard
  if (userId) {
    return redirect("/dashboard");
  }

  try {
    const response = await authApi.googleLogin();
    return json({ authorization_url: response.data.authorization_url });
  } catch (error) {
    console.error("Ошибка при получении URL авторизации:", error);
    return json({ error: "Ошибка при получении URL авторизации" });
  }
};

export default function LoginRoute() {
  return <LoginPage />;
} 