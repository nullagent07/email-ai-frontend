import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, json, redirect, useLoaderData } from "@remix-run/react";
import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { usersApiServer } from "./utils/api.server";
import { parse } from "cookie";
import { deleteAllCookies } from "./utils/cookieUtils";
import tailwindStylesUrl from "./tailwind.css?url";
import { useEffect } from "react";
import type { User } from "./types/user";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesUrl }
];

export type RootLoaderData = {
  user: User | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookieValue = cookieHeader ? parse(cookieHeader) : null;
  const access_token = cookieValue ? cookieValue.access_token : null;
  const currentUrl = new URL(request.url);

  if (!access_token) {
    // Если токен отсутствует, перенаправляем на /login, если не находимся на странице логина
    if (!currentUrl.pathname.includes("/login")) {
      return redirect("/login");
    }
    return json<RootLoaderData>({ user: null });
  }
  
  if (currentUrl.pathname.includes("/login")) {
    return redirect("/dashboard");
  }
  
  try {
    // Проверка токена, отправляя запрос на бэкенд
    const response = await usersApiServer.getUser({ Cookie: cookieHeader });
    
    // Если токен не валиден (401), удаляем все куки и перенаправляем на /login
    if (response.status === 401) {
      return redirect("/login", {
        headers: {
          "Set-Cookie": deleteAllCookies() // Удаление всех кук
        }
      });
    }
    
    // Если токен валиден, возвращаем данные пользователя
    return json<RootLoaderData>({ user: response.data });
  } catch (error) {
    // В случае ошибки запроса удаляем куки и перенаправляем на /login
    console.error("Ошибка при проверке токена:", error);
    return redirect("/login", {
      headers: {
        "Set-Cookie": deleteAllCookies()
      }
    });
  }
};

export default function App() {
  const data = useLoaderData<RootLoaderData>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet context={{ user: data?.user }} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
