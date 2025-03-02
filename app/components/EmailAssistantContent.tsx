import React, { useState, useEffect } from 'react';
import { AssistantProfile, CreateAssistantData } from '../types/email';
import { AssistantProfiles } from './AssistantProfiles';
import { EmailThreads } from './EmailThreads';
import { useNavigate, useLocation } from '@remix-run/react';

export function EmailAssistantContent() {
  const [profiles, setProfiles] = useState<AssistantProfile[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Parse the current URL to get the view and assistantId
  const searchParams = new URLSearchParams(location.search);
  const currentView = searchParams.get('view') || 'profiles';
  const selectedAssistantId = searchParams.get('assistant');

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
    // Update URL with the new view and selected assistant
    const params = new URLSearchParams();
    params.set('view', 'threads');
    params.set('assistant', profileId);
    navigate(`?${params.toString()}`);
  };

  const handleBackToProfiles = () => {
    // Clear URL parameters when going back to profiles
    navigate('');
  };

  return (
    <div className="container mx-auto p-4">
      {currentView === 'profiles' ? (
        <AssistantProfiles
          profiles={profiles}
          onProfileSelect={handleProfileSelect}
          onProfileCreate={handleProfileCreate}
          onProfileEdit={handleProfileEdit}
        />
      ) : selectedAssistantId ? (
        <EmailThreads
          selectedAssistantId={selectedAssistantId}
          assistantName={profiles.find(p => p.profile_id === selectedAssistantId)?.name || 'Assistant'}
          onBack={handleBackToProfiles}
        />
      ) : (
        // Fallback to profiles view if no assistant is selected
        <AssistantProfiles
          profiles={profiles}
          onProfileSelect={handleProfileSelect}
          onProfileCreate={handleProfileCreate}
          onProfileEdit={handleProfileEdit}
        />
      )}
    </div>
  );
}
