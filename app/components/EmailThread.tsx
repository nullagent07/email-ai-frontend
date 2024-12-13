import React from 'react';
import { EmailThread } from '../types/email';
import { Button } from './ui/button';
import { PlayCircle, StopCircle } from 'lucide-react';

interface EmailThreadProps {
  thread: EmailThread;
  onArchive: (threadId: string) => void;
  onStatusChange?: (threadId: string, newStatus: 'active' | 'stopped') => void;
}

export const EmailThreadView: React.FC<EmailThreadProps> = ({
  thread,
  onArchive,
  onStatusChange,
}) => {
  return (
    <div className="flex flex-col space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">
            {thread.recipient_name || thread.recipient_email}
          </h2>
          <p className="text-sm text-gray-500">
            {new Date(thread.creation_date).toLocaleString()}
          </p>          
          <div className="mt-2 space-y-2">
            <p className="text-sm font-medium text-gray-700">Instructions:</p>
            <p className="text-sm text-gray-600">{thread.instructions}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {onStatusChange && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(thread.id, thread.status === 'active' ? 'stopped' : 'active')}
            >
              {thread.status === 'active' ? (
                <>
                  <StopCircle className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onArchive(thread.id)}>
            Archive
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-500">
        <span>Status: {thread.status}</span>
        <span>Assistant: {thread.assistant_id || 'None'}</span>
      </div>
    </div>
  );
}
