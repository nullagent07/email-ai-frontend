import { useLoaderData } from "@remix-run/react";

interface LoginPageProps {
  authorizationUrl: string;
}

export default function LoginPage({ authorizationUrl }: LoginPageProps) {
  const handleGoogleLogin = () => {
    if (authorizationUrl) {
      window.location.href = authorizationUrl;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Войти в систему
          </h2>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Войти через Google
        </button>
      </div>
    </div>
  );
}
