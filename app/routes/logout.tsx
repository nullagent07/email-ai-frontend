import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { getAuthService } from "../services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const authService = await getAuthService();
  await authService.logout();
  return redirect("/login");
}

export async function loader() {
  return redirect("/login");
}