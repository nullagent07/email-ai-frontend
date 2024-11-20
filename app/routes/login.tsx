import { LoaderFunction, redirect } from "@remix-run/node";
import LoginPage from "../components/LoginPage";
import { getUserFromAPI } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  // Проверяем наличие куков
  const cookie = request.headers.get("Cookie");
  if (!cookie?.includes('access_token')) {
    return null;
  }

  // Если есть куки с токеном, проверяем их валидность
  try {
    const user = await getUserFromAPI(request);
    if (user) {
      return redirect("/dashboard");
    }
  } catch (error) {
    // Если токен невалидный, показываем страницу логина
  }
  return null;
};

export default function LoginRoute() {
  return <LoginPage />;
}