// utils/cookieUtils.js

export function deleteAllCookies() {
    const cookiesToDelete = ["access_token"]; // Замените на имена ваших кук
    return cookiesToDelete.map((name) => 
      `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict;`
    ).join("; ");
  }
  