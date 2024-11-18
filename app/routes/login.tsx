import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import LoginPage from "~/components/LoginPage";
import { authApiServer } from "~/utils/api.server";
import { getUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  // Проверяем, не авторизован ли уже пользователь
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/dashboard");
  }

  // Получаем куки из запроса
  const cookieHeader = request.headers.get("Cookie");

  try {
    // Получаем URL для авторизации через Google
    const response = await authApiServer.googleLogin({ "Cookie": cookieHeader });
    const authorizationUrl = response.data.authorization_url;

    // Если есть куки в ответе, передаем их
    const setCookieHeader = response.headers['set-cookie'];
    return json(
      { authorization_url: authorizationUrl },
      {
        headers: setCookieHeader ? { "Set-Cookie": setCookieHeader.join(", ") } : {},
      }
    );
  } catch (error) {
    console.error("Ошибка при получении URL авторизации:", error);
    return json({ 
      authorization_url: null,
      error: "Ошибка при получении URL авторизации" 
    });
  }
};

export default function LoginRoute() {
  const data = useLoaderData<{ authorization_url: string | null }>();
  return <LoginPage authorizationUrl={data.authorization_url || ''} />;
}