import { LoaderFunction, redirect } from "@remix-run/node";
import LoginPage from "../components/LoginPage";
import { getUserFromAPI } from "../services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  // Проверяем авторизацию через API
  const user = await getUserFromAPI(request);
  if (user) {
    return redirect("/dashboard");
  }
  return null;
};

export default function LoginRoute() {
  return <LoginPage />;
}