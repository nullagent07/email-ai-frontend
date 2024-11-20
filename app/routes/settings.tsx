import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { getAssistantService } from "~/services/assistant.server";
import { AssistantProfiles } from "~/components/AssistantProfiles";
import { cn } from "~/lib/utils";
import type { AssistantProfile } from "~/types/email";

export async function loader() {
  const assistantService = await getAssistantService();
  const assistants = await assistantService.listProfiles();

  return json(
    { assistants },
    {
      headers: {
        "Cache-Control": "private, max-age=5"
      }
    }
  );
}

export default function Settings() {
  const { assistants } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 overflow-auto">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            {/* Add your dashboard content here */}
          </div>
        </main>
      </div>
    </div>
  );
}
