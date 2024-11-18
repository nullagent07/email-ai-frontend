import { json, LoaderFunction } from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { requireUser } from "../utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  return json({ user });
};

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar>
              <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold dark:text-white">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
          <nav className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <a href="/dashboard">Dashboard</a>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <a href="/settings">Settings</a>
            </Button>
            <Form action="/logout" method="post">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                type="submit"
              >
                Logout
              </Button>
            </Form>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}