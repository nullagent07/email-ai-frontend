import { useLoaderData } from "@remix-run/react";

export default function LoginPage() {
  const { authorization_url, error } = useLoaderData<{ authorization_url?: string; error?: string }>();

  const handleGoogleLogin = () => {
    if (authorization_url) {
      window.location.href = authorization_url;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Войти в систему
          </h2>
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
        <button
          onClick={handleGoogleLogin}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Войти через Google
        </button>
      </div>
    </div>
  );
}
