import React from 'react';
import { EmailThread, AssistantProfile } from '../types/email';
import { EmailThreadView } from './EmailThread';
// import { AssistantProfiles } from './AssistantProfiles';
import { CreateThreadDialog } from './CreateThreadDialog';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';

export function EmailAssistantContent() {
  const [threads, setThreads] = React.useState<EmailThread[]>([]);
  // const [profiles, setProfiles] = React.useState<AssistantProfile[]>([]);
  // const [selectedProfile, setSelectedProfile] = React.useState<string | null>(null);
  // const [view, setView] = React.useState<'threads' | 'profiles'>('threads');
  
  React.useEffect(() => {
    fetchThreads();
    // fetchProfiles();
  }, []);

  const fetchThreads = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/email/gmail/threads', {
        credentials: 'include',  // Это важно для отправки cookies
      });
      const data = await response.json();
      console.log(data);
      setThreads(data);
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  };

  // const fetchProfiles = async () => {
  //   try {
  //     const response = await fetch('/api/assistant/profiles');
  //     const data = await response.json();
  //     setProfiles(data);
  //   } catch (error) {
  //     console.error('Error fetching profiles:', error);
  //   }
  // };

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

  // const handleProfileCreate = async (profile: Omit<AssistantProfile, 'id'>) => {
  //   try {
  //     const response = await fetch('/api/assistant/profiles', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(profile),
  //     });
  //     const newProfile = await response.json();
  //     setProfiles([...profiles, newProfile]);
  //   } catch (error) {
  //     console.error('Error creating profile:', error);
  //   }
  // };

  // const handleProfileEdit = async (profile: AssistantProfile) => {
  //   try {
  //     await fetch(`/api/assistant/profiles/${profile.id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(profile),
  //     });
  //     setProfiles(
  //       profiles.map((p) => (p.id === profile.id ? profile : p))
  //     );
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //   }
  // };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Email Assistant</h1>
        {/* <div className="space-x-2">
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
        </div> */}
      </div>

      {/* {view === 'threads' ? ( */}
        <div className="space-y-6">
          <div className="flex justify-end mb-4">
            <CreateThreadDialog
              onSubmit={async (data) => {
                try {
                  const response = await fetch('http://localhost:8000/api/email/gmail/threads', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include',  // Добавляем для отправки cookies
                    body: JSON.stringify({
                      recipient_name: data.name,
                      recipient_email: data.email,
                      assistant_description: data.description
                    }),
                  });
                  if (response.ok) {
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
                onSubmit={async (data) => {
                  try {
                    const response = await fetch('http://localhost:8000/api/email/gmail/threads', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      credentials: 'include',  // Добавляем для отправки cookies
                      body: JSON.stringify({
                        recipient_name: data.name,
                        recipient_email: data.email,
                        assistant_description: data.description
                      }),
                    });
                    if (response.ok) {
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
                onArchive={handleArchive}
              />
            ))
          )}
        </div>
      {/* ) : (
        <AssistantProfiles
          profiles={profiles}
          onProfileSelect={setSelectedProfile}
          onProfileCreate={handleProfileCreate}
          onProfileEdit={handleProfileEdit}
        />
      )} */}
    </div>
  );
}
