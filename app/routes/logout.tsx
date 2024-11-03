import { ActionFunction, redirect } from "@remix-run/node";
import { deleteAllCookies } from "~/utils/cookieUtils";

export const action: ActionFunction = async ({ request }) => {
    const cookiesToDelete = deleteAllCookies();
    const headers = new Headers();
    
    // Проверяем, является ли cookiesToDelete массивом
    if (Array.isArray(cookiesToDelete)) {
        cookiesToDelete.forEach(cookie => {
            headers.append("Set-Cookie", cookie);
        });
    } else {
        // Обработка случая, если cookiesToDelete не является массивом
        headers.append("Set-Cookie", cookiesToDelete);
    }

    return redirect("/login", { headers });
};

export const loader = () => redirect("/"); 