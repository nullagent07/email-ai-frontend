import { redirect } from "@remix-run/node";
import { authApiServer, usersApiServer } from "~/utils/api.server";

export async function googleLogin(request: Request): Promise<Response> {
  const response = await authApiServer.googleLogin({
    Cookie: request.headers.get("Cookie")
  });
  return redirect(response.data.url);
}

export async function logout(request: Request): Promise<void> {
  try {
    await authApiServer.logout({
      Cookie: request.headers.get("Cookie")
    });
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

export async function handleCallback(
  code: string, 
  state: string, 
  request: Request
): Promise<string> {
  try {
    const response = await authApiServer.googleCallback(code, state, {
      Cookie: request.headers.get("Cookie")
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error during Google callback:', error);
    throw error;
  }
}

export async function getUserFromAPI(request: Request) {
  try {
    // Add caching header to prevent multiple requests
    const headers = {
      Cookie: request.headers.get("Cookie"),
      'Cache-Control': 'max-age=5' // Cache for 5 seconds
    };
    
    const response = await usersApiServer.getUser({ headers });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      throw redirect("/login");
    }
    console.error('Error getting user:', error);
    return null;
  }
}

export async function requireUserFromAPI(request: Request) {
  const user = await getUserFromAPI(request);
  if (!user) {
    throw redirect("/login");
  }
  return user;
}

export async function logoutFromAPI(request: Request) {
  try {
    await authApiServer.logout({
      Cookie: request.headers.get("Cookie")
    });
  } catch (error) {
    console.error('Error during API logout:', error);
  }
  return redirect("/login");
}
