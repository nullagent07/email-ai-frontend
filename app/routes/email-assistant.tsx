import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserFromAPI } from "../services/auth.server";
import { EmailAssistantContent } from "../components/EmailAssistantContent";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUserFromAPI(request);
  return json({ user });
};

export default function EmailAssistant() {
  const { user } = useLoaderData<typeof loader>();
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 overflow-auto">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <EmailAssistantContent />
        </main>
      </div>
    </div>
  );
}
