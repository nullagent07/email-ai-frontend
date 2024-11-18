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
};

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookieValue = cookieHeader ? parse(cookieHeader) : null;
  const access_token = cookieValue ? cookieValue.access_token : null;
  const currentUrl = new URL(request.url);

  if (!access_token) {
    if (!currentUrl.pathname.includes("/login")) {
      return redirect("/login");
    }
    return json<RootLoaderData>({ user: null });
  }
  
  if (currentUrl.pathname.includes("/login")) {
    return redirect("/dashboard");
  }
  
  try {
    const response = await usersApiServer.getUser({ Cookie: cookieHeader });
    
    if (response.status === 401) {
      return redirect("/login", {
        headers: {
          "Set-Cookie": deleteAllCookies()
        }
      });
    }
    
    return json<RootLoaderData>({ user: response.data });
  } catch (error) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": deleteAllCookies()
      }
    });
  }
};

export default function App() {
  const { user } = useLoaderData<RootLoaderData>();

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
          {user && <Sidebar user={user} />}
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
