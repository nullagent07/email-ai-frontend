// import { createCookieSessionStorage, redirect } from "@remix-run/node";
// import { authApiServer, usersApiServer } from "./api.server";

// Секрет для подписи куки (в продакшене должен быть в переменных окружения)
// const sessionSecret = "super-secret-key";

// const storage = createCookieSessionStorage({
//   cookie: {
//     name: "RJ_session",
//     secure: process.env.NODE_ENV === "production",
//     secrets: [sessionSecret],
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24 * 30, // 30 дней
//     httpOnly: true,
//   },
// });

// export async function createUserSession(userId: string, redirectTo: string) {
//   const session = await storage.getSession();
//   session.set("userId", userId);
//   return redirect(redirectTo, {
//     headers: {
//       "Set-Cookie": await storage.commitSession(session),
//     },
//   });
// }

// export async function getUserSession(request: Request) {
//   return storage.getSession(request.headers.get("Cookie"));
// }

// export async function getUserId(request: Request) {
//   const session = await getUserSession(request);
//   const userId = session.get("userId");
//   if (!userId || typeof userId !== "string") return null;
//   return userId;
// }

// export async function requireUserId(request: Request) {
//   const userId = await getUserId(request);
//   if (!userId) {
//     throw redirect("/login");
//   }
//   return userId;
// }

// export async function requireUser(request: Request) {
//   try {
//     // Получаем куки из запроса
//     const cookieHeader = request.headers.get("Cookie");
    
//     // Пытаемся получить информацию о пользователе через API
//     const response = await usersApiServer.getUser({ "Cookie": cookieHeader });
    
//     if (response.data) {
//       return response.data;
//     }

//     // Если нет данных пользователя, перенаправляем на логин
//     throw redirect("/login");
//   } catch (error) {
//     // В случае ошибки API или отсутствия авторизации, перенаправляем на логин
//     throw redirect("/login");
//   }
// }

// export async function logout(request: Request) {
//   try {
//     // Получаем куки из запроса
//     const cookieHeader = request.headers.get("Cookie");
    
//     // Вызываем API для логаута
//     const response = await authApiServer.logout({ "Cookie": cookieHeader });

//     // Уничтожаем локальную сессию
//     // const session = await getUserSession(request);

//     // Получаем куки из ответа бекенда
//     const cookies = response.headers["set-cookie"] || [];

//     // Объединяем куки из ответа с куки для уничтожения локальной сессии
//     const allCookies = [
//       // await storage.destroySession(session),
//       ...cookies
//     ];

//     return redirect("/login", {
//       headers: {
//         "Set-Cookie": allCookies.join(", ")
//       },
//     });
//   } catch (error) {
//     // В случае ошибки все равно пытаемся уничтожить локальную сессию
//     const session = await getUserSession(request);
//     return redirect("/login", {
//       headers: {
//         // "Set-Cookie": await storage.destroySession(session),
//       },
//     });
//   }
// }
