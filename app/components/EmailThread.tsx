import React from 'react';
import { EmailThread, EmailMessage } from '../types/email';
import { Avatar } from './ui/avatar';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface EmailThreadProps {
  thread: EmailThread;
  onReply: (threadId: string, content: string) => void;
  onArchive: (threadId: string) => void;
}

export const EmailThreadView: React.FC<EmailThreadProps> = ({
  thread,
  onReply,
  onArchive,
}) => {
  const [isAiSuggestionOpen, setIsAiSuggestionOpen] = React.useState(false);
  const [replyContent, setReplyContent] = React.useState('');

  const handleAiSuggest = () => {
    setIsAiSuggestionOpen(true);
    // Here we'll show AI's suggestion from thread.aiAssistant.lastSuggestion
  };

  const handleSendReply = () => {
    onReply(thread.id, replyContent);
    setReplyContent('');
  };

  return (
    <div className="flex flex-col space-y-4 p-4 bg-white rounded-lg shadow">
      {/* Thread Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{thread.subject}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onArchive(thread.id)}>
            Archive
          </Button>
          <Button variant="outline" onClick={handleAiSuggest}>
            Get AI Suggestion
          </Button>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {thread.messages.map((message: EmailMessage) => (
          <div key={message.id} className="flex space-x-4 p-4 border rounded">
            <Avatar>
              <div className="h-full w-full flex items-center justify-center bg-primary text-white">
                {message.from[0].toUpperCase()}
              </div>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-medium">{message.from}</span>
                <span className="text-gray-500">
                  {new Date(message.date).toLocaleString()}
                </span>
              </div>
              <div className="mt-2 text-gray-700">{message.content}</div>
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-gray-500">Attachments:</span>
                  <div className="flex space-x-2 mt-1">
                    {message.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="px-3 py-1 bg-gray-100 rounded text-sm"
                      >
                        {attachment.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reply Section */}
      <div className="mt-4">
        <textarea
          className="w-full p-3 border rounded-lg"
          rows={4}
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Write your reply..."
        />
        <div className="mt-2 flex justify-end">
          <Button onClick={handleSendReply}>Send Reply</Button>
        </div>
      </div>

      {/* AI Suggestion Dialog */}
      <Dialog open={isAiSuggestionOpen} onOpenChange={setIsAiSuggestionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Assistant Suggestion</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-gray-700">{thread.aiAssistant.lastSuggestion}</p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAiSuggestionOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setReplyContent(thread.aiAssistant.lastSuggestion || '');
                  setIsAiSuggestionOpen(false);
                }}
              >
                Use Suggestion
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
