import { LoaderFunction, redirect } from "@remix-run/node";
import LoginPage from "../components/LoginPage";
import { getUserId } from "../utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  // Проверяем, не авторизован ли уже пользователь
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/dashboard");
  }
  return null;
};

export default function LoginRoute() {
  return <LoginPage />;
}