import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, json, redirect, useLoaderData } from "@remix-run/react";
import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { usersApi } from "./utils/api.server";
import { parse } from "cookie";
import { deleteAllCookies } from "./utils/cookieUtils";
import { GlobalProvider, useGlobalContext } from './context/GlobalContext';
import tailwindStylesUrl from "./tailwind.css?url";
import { useEffect } from "react";
import { User } from "./context/GlobalContext";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesUrl }
];

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
  } else {
    // Если токен присутствует и мы находимся на странице логина, перенаправляем на /dashboard
    if (currentUrl.pathname.includes("/login")) {
      return redirect("/dashboard");
    }
    try {
      // Проверка токена, отправляя запрос на бэкенд
      const response = await usersApi.getUser({ Cookie: cookieHeader });
      
      // Если токен не валиден (401), удаляем все куки и перенаправляем на /login
      if (response.status === 401) {
        return redirect("/login", {
          headers: {
            "Set-Cookie": deleteAllCookies() // Удаление всех кук
          }
        });
      }
      
      // Если токен валиден, возвращаем данные пользователя
      return json({ user: response.data });
    } catch (error) {
      // В случае ошибки запроса удаляем куки и перенаправляем на /login
      console.error("Ошибка при проверке токена:", error);
      return redirect("/login", {
        headers: {
          "Set-Cookie": deleteAllCookies()
        }
      });
    }
  }

  return null; // Если все проверки пройдены, возвращаем null
};

export default function App() {
  const data = useLoaderData<{ user: User }>();

  return (
    <GlobalProvider>
      <UserDataInitializer userData={data?.user} />
      <html lang="ru">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </GlobalProvider>
  );
}

function UserDataInitializer({ userData }: { userData: User | null }) {
  const { setUser } = useGlobalContext();

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);

  return null;
}
