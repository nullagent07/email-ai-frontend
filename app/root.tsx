import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, json, redirect, useLoaderData } from "@remix-run/react";
import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { usersApiServer } from "./utils/api.server";
import { parse } from "cookie";
import { deleteAllCookies } from "./utils/cookieUtils";
import tailwindStylesUrl from "./tailwind.css?url";
import { Sidebar } from "./components/Sidebar";
import { useEffect } from "react";
import type { User } from "./types/user";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesUrl },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" }
];

export type RootLoaderData = {
  user: User | null;
  isAuthenticated: boolean;
};

// Кэшируем результат проверки аутентификации
let authCache: { user: User | null; timestamp: number } | null = null;
const CACHE_DURATION = 5000; // 5 секунд

export const loader: LoaderFunction = async ({ request }) => {
  const currentUrl = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");
  const cookieValue = cookieHeader ? parse(cookieHeader) : null;
  const access_token = cookieValue ? cookieValue.access_token : null;

  // Если есть access_token, проверяем его валидность
  if (access_token) {
    try {
      const response = await usersApiServer.getUser({ 
        Cookie: cookieHeader
      });
      
      // Обновляем кэш
      authCache = {
        user: response.data,
        timestamp: Date.now()
      };
      
      return json<RootLoaderData>({ 
        user: response.data,
        isAuthenticated: true
      });
    } catch (error: any) {
      // Если токен невалидный, очищаем его
      if (error.response?.status === 401) {
        return redirect("/login", {
          headers: {
            "Set-Cookie": deleteAllCookies()
          }
        });
      }
      throw error;
    }
  }

  // Для публичных роутов без токена возвращаем не авторизован
  if (currentUrl.pathname === "/login" || currentUrl.pathname === "/") {
    return json<RootLoaderData>({ 
      user: null, 
      isAuthenticated: false 
    });
  }

  // Для всех остальных роутов без токена редиректим на логин
  return redirect("/login");
};

export default function App() {
  const { user, isAuthenticated } = useLoaderData<RootLoaderData>();
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen">
          {isAuthenticated && user && <Sidebar user={user} />}
          <div className="flex-1">
            <Outlet context={{ user }} />
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
