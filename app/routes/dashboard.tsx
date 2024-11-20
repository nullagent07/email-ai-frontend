import { json, LoaderFunction } from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { requireUserFromAPI } from "../services/auth.server";
import React from 'react';
import { EmailThread, AssistantProfile } from '../types/email';
import { EmailThreadView } from '../components/EmailThread';
import { AssistantProfiles } from '../components/AssistantProfiles';
import { CreateThreadDialog } from '../components/CreateThreadDialog';
import { PlusCircle } from 'lucide-react';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUserFromAPI(request);
  return json({ user });
};

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();
  
  const [threads, setThreads] = React.useState<EmailThread[]>([]);
  const [profiles, setProfiles] = React.useState<AssistantProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = React.useState<string | null>(null);
  const [view, setView] = React.useState<'threads' | 'profiles'>('threads');

  // Здесь будем загружать данные при монтировании компонента
  React.useEffect(() => {
    // Загрузка тредов
    fetchThreads();
    // Загрузка профилей ассистентов
    fetchProfiles();
  }, []);

  const fetchThreads = async () => {
    try {
      const response = await fetch('/api/email/threads');
      const data = await response.json();
      setThreads(data);
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/assistant/profiles');
      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleReply = async (threadId: string, content: string) => {
    try {
      await fetch(`/api/email/threads/${threadId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          assistantProfileId: selectedProfile,
        }),
      });
      // Обновляем треды после отправки ответа
      fetchThreads();
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const handleArchive = async (threadId: string) => {
    try {
      await fetch(`/api/email/threads/${threadId}/archive`, {
        method: 'POST',
      });
      fetchThreads();
    } catch (error) {
      console.error('Error archiving thread:', error);
    }
  };

  const handleProfileCreate = async (profile: Omit<AssistantProfile, 'id'>) => {
    try {
      const response = await fetch('/api/assistant/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      const newProfile = await response.json();
      setProfiles([...profiles, newProfile]);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const handleProfileEdit = async (profile: AssistantProfile) => {
    try {
      await fetch(`/api/assistant/profiles/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      setProfiles(
        profiles.map((p) => (p.id === profile.id ? profile : p))
      );
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="container mx-auto p-4">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Email Assistant</h1>
              <div className="space-x-2">
                <Button
                  variant={view === 'threads' ? 'default' : 'outline'}
                  onClick={() => setView('threads')}
                >
                  Email Threads
                </Button>
                <Button
                  variant={view === 'profiles' ? 'default' : 'outline'}
                  onClick={() => setView('profiles')}
                >
                  Assistant Profiles
                </Button>
              </div>
            </div>

            {view === 'threads' ? (
              <div className="space-y-6">
                <div className="flex justify-end mb-4">
                  <CreateThreadDialog
                    existingAssistants={profiles}
                    onSubmit={async (data) => {
                      try {
                        const response = await fetch('/api/email/threads', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(data),
                        });
                        if (response.ok) {
                          // Обновляем список тредов после создания
                          fetchThreads();
                        }
                      } catch (error) {
                        console.error('Error creating thread:', error);
                      }
                    }}
                    trigger={
                      <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Thread
                      </Button>
                    }
                  />
                </div>
                {threads.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-500">No email threads yet</p>
                    <p className="text-sm text-gray-400 mt-1">Start by creating your first thread</p>
                    <CreateThreadDialog
                      existingAssistants={profiles}
                      onSubmit={async (data) => {
                        try {
                          const response = await fetch('/api/email/threads', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                          });
                          if (response.ok) {
                            // Обновляем список тредов после создания
                            fetchThreads();
                          }
                        } catch (error) {
                          console.error('Error creating thread:', error);
                        }
                      }}
                      trigger={
                        <Button className="mt-4">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Create Your First Thread
                        </Button>
                      }
                    />
                  </div>
                ) : (
                  threads.map((thread) => (
                    <EmailThreadView
                      key={thread.id}
                      thread={thread}
                      onReply={handleReply}
                      onArchive={handleArchive}
                    />
                  ))
                )}
              </div>
            ) : (
              <AssistantProfiles
                profiles={profiles}
                onProfileSelect={setSelectedProfile}
                onProfileCreate={handleProfileCreate}
                onProfileEdit={handleProfileEdit}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}