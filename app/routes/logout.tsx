import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { authApiServer } from "../utils/api.server";

export async function action({ request }: ActionFunctionArgs) {
  const response = await authApiServer.logout({
    Cookie: request.headers.get("Cookie")
  });
  
  // Создаем ответ с редиректом
  const redirectResponse = redirect("/login");
  
  // Добавляем заголовок для удаления куки access_token
  redirectResponse.headers.append("Set-Cookie", "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly");
  
  return redirectResponse;
}

export async function loader() {
  const response = redirect("/login");
  response.headers.append("Set-Cookie", "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly");
  return response;
}