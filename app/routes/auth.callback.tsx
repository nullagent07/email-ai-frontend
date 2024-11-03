import { LoaderFunction, redirect } from "@remix-run/node";
import { authApiServer, usersApiServer } from "~/utils/api.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  
  if (status === "success") {
    try {      
      return redirect("/dashboard");
    } catch (error) {
      console.error("Ошибка при аутентификации:", error);
    }
  }
  
  return redirect("/login");
};

export default function Callback() {
  return null;
} 