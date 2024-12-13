import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { CreateThreadData } from '../types/email';

interface CreateThreadDialogProps {
  onSubmit: (data: CreateThreadData) => void;
  trigger: React.ReactNode;
}

export function CreateThreadDialog({ onSubmit, trigger }: CreateThreadDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateThreadData>({
    recipient_email: '',
    recipient_name: '',
    instructions: '',
    status: 'stopped'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setOpen(false);
    setFormData({
      recipient_email: '',
      recipient_name: '',
      instructions: '',
      status: 'stopped'
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Thread</DialogTitle>
          <DialogDescription>
            Enter the recipient's details and instructions for the assistant.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipient_email" className="text-right">
                Email
              </Label>
              <Input
                id="recipient_email"
                type="email"
                className="col-span-3"
                value={formData.recipient_email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    recipient_email: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipient_name" className="text-right">
                Name
              </Label>
              <Input
                id="recipient_name"
                className="col-span-3"
                value={formData.recipient_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    recipient_name: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instructions" className="text-right">
                Instructions
              </Label>
              <Textarea
                id="instructions"
                className="col-span-3"
                value={formData.instructions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    instructions: e.target.value,
                  })
                }
                placeholder="Enter instructions for the assistant..."
                required
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex justify-end">
              <Button type="submit">Create Thread</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
