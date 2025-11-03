import React from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '../components/ui/Header';
import { SideHomeView } from '../components/views/SideHomeView';
import { ProfileView } from '../components/Profile/ProfileView';
import { useAuth } from '../hooks';
import type { NavigationView, UserProfileState } from '../types/navigation';

interface ProfilePageProps {
  onNavigationChange?: (view: NavigationView, userDetails?: UserProfileState) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigationChange }) => {
  const { isAuthenticated } = useAuth();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-rixa-dark">
      <Header />
      <div className="flex">
        <main className="flex-1">
          <div className="max-w-5xl mx-auto border-x border-b border-rixa-blue/20 h-full flex justify-center">
            <div className="h-full w-full sm:w-2/3">
              <ProfileView />
            </div>
            <div className="h-full w-1/3 border border-rixa-blue/20 border-y-0 border-l-1 border-r-0 hidden sm:block">
              <SideHomeView onUserClick={onNavigationChange} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};