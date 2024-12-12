import React from 'react';
import { AssistantProfile, CreateAssistantData } from '../types/email';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AssistantProfilesProps {
  profiles: AssistantProfile[];
  onProfileSelect: (profileId: string) => void;
  onProfileCreate: (profile: CreateAssistantData) => void;
  onProfileEdit: (profileId: string, profile: CreateAssistantData) => void;
}

const AVAILABLE_CAPABILITIES = [
  'email_communication',
  'task_management',
  'scheduling',
  'document_processing'
];

const AVAILABLE_MODELS = [
  'gpt-4',
  'gpt-3.5-turbo'
];

export const AssistantProfiles: React.FC<AssistantProfilesProps> = ({
  profiles,
  onProfileSelect,
  onProfileCreate,
  onProfileEdit,
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [editingProfileId, setEditingProfileId] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<CreateAssistantData>({
    name: '',
    instruction: '',
    capabilities: [],
    model: 'gpt-4',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProfileId) {
      onProfileEdit(editingProfileId, formData);
    } else {
      onProfileCreate(formData);
    }
    setIsCreateDialogOpen(false);
    setEditingProfileId(null);
    setFormData({
      name: '',
      instruction: '',
      capabilities: [],
      model: 'gpt-4',
      description: ''
    });
  };

  const handleEdit = (profile: AssistantProfile) => {
    setEditingProfileId(profile.profile_id);
    setFormData({
      name: profile.name || '',
      instruction: profile.instruction,
      capabilities: profile.capabilities || [],
      model: profile.model || 'gpt-4',
      description: profile.description || ''
    });
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Assistant Profiles</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Create New Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <div
            key={profile.profile_id}
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
              <p className="font-medium mb-1">Instructions:</p>
              <p className="text-gray-600">{profile.instruction}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProfileId ? 'Edit Profile' : 'Create New Profile'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Instructions</Label>
              <Textarea
                value={formData.instruction}
                onChange={(e) =>
                  setFormData({ ...formData, instruction: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Model</Label>
              <Select
                value={formData.model || 'gpt-4'}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, model: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_MODELS.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Capabilities</Label>
              <div className="space-y-2">
                {AVAILABLE_CAPABILITIES.map((capability) => (
                  <label key={capability} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.capabilities.includes(capability)}
                      onChange={(e) => {
                        const newCapabilities = e.target.checked
                          ? [...formData.capabilities, capability]
                          : formData.capabilities.filter((c) => c !== capability);
                        setFormData({ ...formData, capabilities: newCapabilities });
                      }}
                    />
                    <span>{capability}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                {editingProfileId ? 'Save Changes' : 'Create Profile'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
