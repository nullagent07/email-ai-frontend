import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { parse } from "cookie";
import LoginPage from "~/components/LoginPage";
import { authApi, usersApi } from "~/utils/api.server";

export const loader: LoaderFunction = async ({ request }) => {
   // Извлекаем заголовок Cookie из исходного запроса
   const cookieHeader = request.headers.get("Cookie");

   // Парсим куки, если необходимо
   const cookieValue = cookieHeader ? parse(cookieHeader) : null;
   
  //  if (cookieValue) {
  //    const oauthToken = cookieValue.access_token;
  //   //  console.log("Access Token:", oauthToken);
 
  //    // Передаем куки в запрос на бэкенд
  //    try {
  //      const response = await usersApi.getUser({ "Cookie": cookieHeader });
  //      console.log(response.status);
  //      if (response.status === 200) {
  //        // Пользователь аутентифицирован, перенаправляем на dashboard
  //        return redirect("/dashboard");
  //      }
  //    } catch (error) {
  //      console.error("Ошибка проверки аутентификации:", error);
  //      // Обработка ошибки или продолжение с логикой авторизации
  //    }
  //  }
 
   // Если пользователь не аутентифицирован, получаем URL авторизации
   try {
     const response = await authApi.googleLogin({ "Cookie": cookieHeader });
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