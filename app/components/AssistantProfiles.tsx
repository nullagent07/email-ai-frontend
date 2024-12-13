import React from 'react';
import { AssistantProfile, CreateAssistantData } from '../types/email';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PlusCircle } from 'lucide-react';

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

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Assistant Profiles</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="h-5 w-5 mr-2" />
          Create Assistant
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <div
            key={profile.profile_id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onProfileSelect(profile.profile_id)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">{profile.name}</h3>
                <p className="text-sm text-gray-600">{profile.model || 'GPT-4'}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingProfileId(profile.profile_id);
                  setFormData({
                    name: profile.name,
                    instruction: profile.instruction,
                    capabilities: profile.capabilities || [],
                    model: profile.model || 'gpt-4',
                    description: profile.description || ''
                  });
                  setIsCreateDialogOpen(true);
                }}
              >
                Edit
              </Button>
            </div>
            {profile.description && (
              <p className="text-sm text-gray-600 mb-4">{profile.description}</p>
            )}
            {profile.capabilities && profile.capabilities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProfileId ? 'Edit Assistant Profile' : 'Create Assistant Profile'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instruction">Instruction</Label>
              <Textarea
                id="instruction"
                value={formData.instruction}
                onChange={(e) =>
                  setFormData({ ...formData, instruction: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select
                value={formData.model}
                onValueChange={(value) =>
                  setFormData({ ...formData, model: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
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
            <div className="space-y-2">
              <Label>Capabilities</Label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_CAPABILITIES.map((capability) => (
                  <Button
                    key={capability}
                    type="button"
                    variant={
                      formData.capabilities.includes(capability)
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() => {
                      const newCapabilities = formData.capabilities.includes(
                        capability
                      )
                        ? formData.capabilities.filter((cap) => cap !== capability)
                        : [...formData.capabilities, capability];
                      setFormData({ ...formData, capabilities: newCapabilities });
                    }}
                  >
                    {capability}
                  </Button>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full">
              {editingProfileId ? 'Save Changes' : 'Create Profile'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
