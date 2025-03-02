import React, { useState, useEffect } from 'react';
import { EmailThread, CreateThreadData } from '../types/email';
import { EmailThreadView } from './EmailThread';
import { Button } from './ui/button';
import { CreateThreadDialog } from './CreateThreadDialog';
import { Mail, ArrowLeft } from 'lucide-react';

interface EmailThreadsProps {
  onBack: () => void;
  selectedAssistantId: string;
  assistantName: string;
}

export function EmailThreads({ onBack, selectedAssistantId, assistantName }: EmailThreadsProps) {
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchThreads();
  }, [selectedAssistantId]);

  const fetchThreads = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:8000/api/email-threads/${selectedAssistantId}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch threads');
      }
      const data = await response.json();
      setThreads(data);
    } catch (error) {
      console.error('Error fetching threads:', error);
      setError('Failed to load email threads. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateThread = async (threadData: CreateThreadData) => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:8000/api/email-threads/${selectedAssistantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(threadData),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to create thread');
      }
      
      await fetchThreads();
    } catch (error) {
      console.error('Error creating thread:', error);
      setError('Failed to create thread. Please try again.');
    }
  };

  const handleArchive = async (threadId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/email-threads/${threadId}/archive`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to archive thread');
      }
      await fetchThreads();
    } catch (error) {
      console.error('Error archiving thread:', error);
      setError('Failed to archive thread. Please try again.');
    }
  };

  const handleStatusChange = async (threadId: string, newStatus: 'active' | 'stopped') => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:8000/api/email-threads/${threadId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update thread status');
      }
      
      await fetchThreads();
    } catch (error) {
      console.error('Error updating thread status:', error);
      setError('Failed to update thread status. Please try again.');
    }
  };

  const handleStartThread = async (threadId: string) => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:8000/api/email-threads/status/${selectedAssistantId}/${threadId}`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to start thread');
      }
      
      await fetchThreads();
    } catch (error) {
      console.error('Error starting thread:', error);
      setError('Failed to start thread. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">
            Assistant: "<span className="text-blue-600">{assistantName}</span>"
          </h1>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-display font-semibold tracking-tight text-gray-900">Email Threads</h2>
        <CreateThreadDialog
          onSubmit={handleCreateThread}
          trigger={
            <Button>
              <Mail className="h-5 w-5 mr-2" />
              New Thread
            </Button>
          }
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">
          Loading threads...
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      ) : (
        <div className="grid gap-4">
          {threads.map((thread) => (
            <EmailThreadView
              key={thread.id}
              thread={thread}
              onArchive={handleArchive}
              onStatusChange={handleStatusChange}
              onStart={handleStartThread}
            />
          ))}
          {threads.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No email threads yet. Create one to get started!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
