import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { parse } from "cookie";
import LoginPage from "~/components/LoginPage";
import { authApiServer, usersApiServer } from "~/utils/api.server";

export const loader: LoaderFunction = async ({ request }) => {
   // Извлекаем заголовок Cookie из исходного запроса
   const cookieHeader = request.headers.get("Cookie");
 
   // Если пользователь не аутентифицирован, получаем URL авторизации
   try {
     const response = await authApiServer.googleLogin({ "Cookie": cookieHeader });
     const authorizationUrl = response.data.authorization_url;
 
     // Установка куки в ответе, если необходимо
     const setCookieHeader = response.headers['set-cookie'];

     return json(
       { authorization_url: authorizationUrl }, 
       {
         headers: setCookieHeader ? { "Set-Cookie": setCookieHeader.join(", ") } : {},
       }
     );
   } catch (error: any) {
     console.error("Ошибка при получении URL авторизации:", error);
     return json({ 
       error: "Ошибка при получении URL авторизации",
       authorization_url: null 
     });
   }
 };

export default function LoginRoute() {
  const data = useLoaderData() as { authorization_url: string | null };
  return <LoginPage authorizationUrl={data.authorization_url || ''} />;
}