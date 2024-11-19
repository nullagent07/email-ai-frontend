import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      window.location.href = 'http://localhost:8000/api/auth/google/login';
    } catch (error) {
      console.error('Error during login:', error);
      alert('Failed to start login process. Please try again.');
      setIsLoading(false);
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
          disabled={isLoading}
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
            !isLoading 
              ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600' 
              : 'bg-blue-400 cursor-not-allowed'
          }`}
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
            {isLoading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </span>
          {isLoading ? 'Подождите...' : 'Войти через Google'}
        </button>
      </div>
    </div>
  );
}
