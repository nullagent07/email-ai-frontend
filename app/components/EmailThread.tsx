import React from 'react';
import { EmailThread } from '../types/email';
import { Button } from './ui/button';

interface EmailThreadProps {
  thread: EmailThread;
  onArchive: (threadId: string) => void;
}

export const EmailThreadView: React.FC<EmailThreadProps> = ({
  thread,
  onArchive,
}) => {
  return (
    <div className="flex flex-col space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            {thread.recipient_name || thread.recipient_email}
          </h2>
          <p className="text-sm text-gray-500">
            {new Date(thread.creation_date).toLocaleString()}
          </p>
          {thread.description && (
            <p className="text-gray-600 mt-2">{thread.description}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onArchive(thread.id)}>
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
