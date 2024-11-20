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
  { rel: "stylesheet", href: tailwindStylesUrl }
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
  
  // Пропускаем проверку для публичных роутов
  if (currentUrl.pathname === "/login" || currentUrl.pathname === "/") {
    return json<RootLoaderData>({ 
      user: null, 
      isAuthenticated: false 
    });
  }

  const cookieHeader = request.headers.get("Cookie");
  const cookieValue = cookieHeader ? parse(cookieHeader) : null;
  const access_token = cookieValue ? cookieValue.access_token : null;

  if (!access_token) {
    return redirect("/login");
  }

  // Проверяем кэш
  if (authCache && (Date.now() - authCache.timestamp) < CACHE_DURATION) {
    return json<RootLoaderData>({ 
      user: authCache.user,
      isAuthenticated: true
    });
  }
  
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
    if (error.response?.status === 401) {
      return redirect("/login", {
        headers: {
          "Set-Cookie": deleteAllCookies()
        }
      });
    }
    throw error;
  }
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
