import { json, LoaderFunction } from "@remix-run/node";
import { Outlet, useOutletContext } from "@remix-run/react";
import type { User } from "../types/user";

type ContextType = { user: User | null };

export default function Dashboard() {
  const { user } = useOutletContext<ContextType>();
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 overflow-auto">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            {/* Add your dashboard content here */}
          </div>
        </main>
      </div>
    </div>
  );
}