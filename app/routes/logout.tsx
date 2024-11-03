import { ActionFunction, redirect, json } from "@remix-run/node";
import { authApiServer } from "~/utils/api.server";
import { parse } from "cookie";

export const action: ActionFunction = async ({ request }) => {
    const cookieHeader = request.headers.get("Cookie");
    const cookieValue = cookieHeader ? parse(cookieHeader) : null;

    try {
        const response = await authApiServer.logout();

        if (response.status !== 200) {
            throw new Error("Logout failed");
        }

        const setCookieHeader = response.headers['set-cookie'];

        return json(
            { message: "Logout successful" }, 
            {
                headers: setCookieHeader ? { "Set-Cookie": setCookieHeader.join(", ") } : {},
            }
        );
    } catch (error) {
        console.error("Ошибка при выходе:", error);
        throw new Error("Logout failed");
    }
};

export const loader = () => redirect("/"); 