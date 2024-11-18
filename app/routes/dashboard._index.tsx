import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { getGmailService } from "../services/gmail.server";
import { getAssistantService } from "../services/assistant.server";
import type { EmailThread, AssistantProfile } from "../types/email";
import { CreateThreadDialog } from "../components/CreateThreadDialog";
import { Button } from "../components/ui/button";
import { PlusCircle } from "lucide-react";

export async function loader() {
  const gmailService = await getGmailService();
  const assistantService = await getAssistantService();

  const threads = await gmailService.listThreads();
  const assistants = await assistantService.listProfiles();

  return json({ threads, assistants });
}

export default function DashboardIndex() {
  const { threads, assistants } = useLoaderData<typeof loader>();

  const handleCreateThread = async (data: {
    contact: {
      name: string;
      email: string;
      additionalInfo: string;
    };
    assistant: AssistantProfile | {
      name: string;
      description: string;
      instructions: string;
    };
    useExisting: boolean;
  }) => {
    console.log("Creating thread with data:", data);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Threads</h1>
          <p className="text-muted-foreground mt-1">
            Manage your email conversations with AI assistance
          </p>
        </div>
        <CreateThreadDialog
          existingAssistants={assistants}
          onSubmit={handleCreateThread}
          trigger={
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Thread
            </Button>
          }
        />
      </div>

      <div className="grid gap-6">
        {threads.map((thread) => (
          <Card key={thread.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{thread.subject}</CardTitle>
                  <CardDescription>
                    {thread.participants.join(", ")}
                  </CardDescription>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(thread.lastMessageDate).toLocaleDateString()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    thread.status === 'active' ? 'bg-green-100 text-green-800' :
                    thread.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {thread.status}
                  </span>
                  {thread.aiAssistant && (
                    <span className="text-sm text-muted-foreground">
                      Assistant: {thread.aiAssistant.profile}
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {thread.messages.length} messages
                </span>
              </div>
            </CardContent>
          </Card>
        ))}

        {threads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No email threads yet</p>
            <p className="text-sm text-gray-400 mt-1">Start by creating your first thread</p>
            <CreateThreadDialog
              existingAssistants={assistants}
              onSubmit={handleCreateThread}
              trigger={
                <Button className="mt-4 gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create Your First Thread
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
