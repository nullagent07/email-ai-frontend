import { Outlet, Form, useMatches } from "@remix-run/react";
import { useGlobalContext } from '../context/GlobalContext';

interface User {
  name: string;
  email: string;
  is_subscription_active: boolean;
}

export default function Dashboard() {
  const { user } = useGlobalContext();
  const matches = useMatches();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">Dashboard</h1>
              <span className="ml-4 text-gray-500">{user?.email}</span>
            </div>
            <div className="flex items-center">
              <Form action="/logout" method="post">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                  Выйти
                </button>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
} 