import { redirect } from "@remix-run/node";
import { authApiServer, usersApiServer } from "~/utils/api.server";

export class AuthService {
  async login(email: string, password: string): Promise<string> {
    // TODO: Implement actual login logic
    return "dummy-token";
  }

  async logout(): Promise<void> {
    try {
      await authApiServer.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  async handleCallback(code: string, state: string): Promise<string> {
    try {
      const response = await authApiServer.googleCallback(code, state);
      
      // Получаем токен из cookie или из ответа
      const token = response.headers['set-cookie']?.find(cookie => 
        cookie.startsWith('access_token=')
      )?.split(';')[0].split('=')[1];

      if (!token) {
        throw new Error('No token received from server');
      }

      return token;
    } catch (error) {
      console.error('Error during OAuth callback:', error);
      throw error;
    }
  }

  async validateToken(token: string): Promise<boolean> {
    // TODO: Implement actual token validation
    return true;
  }
}

let authService: AuthService | null = null;

export async function getAuthService(): Promise<AuthService> {
  if (!authService) {
    authService = new AuthService();
  }
  return authService;
}

export async function getUserFromAPI(request: Request) {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const response = await usersApiServer.getUser({ 
      Cookie: cookieHeader,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function requireUserFromAPI(request: Request) {
  const user = await getUserFromAPI(request);
  if (!user) {
    throw redirect("/login?t=" + new Date().getTime());
  }
  return user;
}

export async function logoutFromAPI(request: Request) {
  try {
    const cookieHeader = request.headers.get("Cookie");
    await authApiServer.logout({ 
      Cookie: cookieHeader,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
  return redirect("/login?t=" + new Date().getTime());
}
