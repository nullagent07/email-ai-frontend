import React, { useState, useEffect } from 'react';
import { AssistantProfile, CreateAssistantData } from '../types/email';
import { AssistantProfiles } from './AssistantProfiles';
import { EmailThreads } from './EmailThreads';

export function EmailAssistantContent() {
  const [profiles, setProfiles] = useState<AssistantProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [view, setView] = useState<'profiles' | 'threads'>('profiles');

  useEffect(() => {
    console.log('Component mounted, fetching profiles...');
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      console.log('Fetching assistants...');
      const response = await fetch('http://localhost:8000/api/assistants', {
        credentials: 'include',
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch profiles: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      console.log('Fetched assistants:', data);
      setProfiles(data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleProfileCreate = async (profile: CreateAssistantData) => {
    try {
      console.log('Creating profile with data:', profile);
      const response = await fetch('http://localhost:8000/api/assistants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profile),
      });
      console.log('Create response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to create profile: ${response.status} ${errorText}`);
      }
      const newProfile = await response.json();
      console.log('Created profile:', newProfile);
      await fetchProfiles();
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const handleProfileEdit = async (profileId: string, profile: CreateAssistantData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/assistants/${profileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profile),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      const updatedProfile = await response.json();
      setProfiles(
        profiles.map((p) => (p.profile_id === profileId ? updatedProfile : p))
      );
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfile(profileId);
    setView('threads');
  };

  const handleBackToProfiles = () => {
    setView('profiles');
    setSelectedProfile(null);
  };

  return (
    <div className="container mx-auto p-4">
      {view === 'profiles' ? (
        <AssistantProfiles
          profiles={profiles}
          onProfileSelect={handleProfileSelect}
          onProfileCreate={handleProfileCreate}
          onProfileEdit={handleProfileEdit}
        />
      ) : (
        selectedProfile && (
          <EmailThreads
            selectedAssistantId={selectedProfile}
            onBack={handleBackToProfiles}
          />
        )
      )}
    </div>
  );
}
