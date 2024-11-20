import React from 'react';
import { AssistantProfile } from '../types/email';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface AssistantProfilesProps {
  profiles: AssistantProfile[];
  onProfileSelect: (profileId: string) => void;
  onProfileCreate: (profile: Omit<AssistantProfile, 'id'>) => void;
  onProfileEdit: (profile: AssistantProfile) => void;
}

export const AssistantProfiles: React.FC<AssistantProfilesProps> = ({
  profiles,
  onProfileSelect,
  onProfileCreate,
  onProfileEdit,
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [editingProfile, setEditingProfile] = React.useState<AssistantProfile | null>(null);

  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    tone: '',
    language: '',
    customInstructions: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProfile) {
      onProfileEdit({ ...editingProfile, ...formData });
    } else {
      onProfileCreate(formData);
    }
    setIsCreateDialogOpen(false);
    setEditingProfile(null);
    setFormData({
      name: '',
      description: '',
      tone: '',
      language: '',
      customInstructions: '',
    });
  };

  const handleEdit = (profile: AssistantProfile) => {
    setEditingProfile(profile);
    setFormData({
      name: profile.name,
      description: profile.description,
      tone: profile.tone,
      language: profile.language,
      customInstructions: profile.customInstructions || '',
    });
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Assistant Profiles</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
        <PlusCircle className="h-4 w-4 mr-2" />
          Create New Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{profile.name}</h3>
              <Button variant="ghost" onClick={() => handleEdit(profile)}>
                Edit
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-2">{profile.description}</p>
            <div className="text-sm">
              <div className="flex space-x-2">
                <span className="font-medium">Tone:</span>
                <span>{profile.tone}</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-medium">Language:</span>
                <span>{profile.language}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProfile ? 'Edit Profile' : 'Create New Profile'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                className="w-full p-2 border rounded"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tone</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.tone}
                onChange={(e) =>
                  setFormData({ ...formData, tone: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Custom Instructions
              </label>
              <textarea
                className="w-full p-2 border rounded"
                value={formData.customInstructions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customInstructions: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setEditingProfile(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingProfile ? 'Save Changes' : 'Create Profile'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
