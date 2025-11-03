import React from 'react';
import { Header } from '../components/ui/Header';
import { HomeView } from '../components/views/HomeView';
import { SideHomeView } from '../components/views/SideHomeView';
import type { NavigationView, UserProfileState } from '../types/navigation';

interface HomePageProps {
  onNavigationChange?: (view: NavigationView, userDetails?: UserProfileState) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigationChange }) => {
  return (
    <div className="min-h-screen bg-rixa-dark">
      <Header />
      <div className="flex">
        <main className="flex-1">
          <HomeView />
        </main>
        <aside className="w-80">
          <SideHomeView onUserClick={onNavigationChange} />
        </aside>
      </div>
    </div>
  );
};