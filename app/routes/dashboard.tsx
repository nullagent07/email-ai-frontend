import { LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requireUserId } from "~/utils/session.server";
import { useSessionTimeout } from "~/hooks/useSessionTimeout";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

export default function Dashboard() {
  useSessionTimeout();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
} 