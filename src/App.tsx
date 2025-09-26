import React, { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Header,
  HomeView,
  ProfileView,
  SettingsView,
  LoginView,
  PostDetails,
} from "./components";
import { useAuth } from "./hooks";
import { SideHomeView } from "./components/SideHomeView";
import type { NavigationView } from "./types/navigation";
import type { PostDetailsState } from "./types/navigation";
import { queryClient } from "./lib/queryClient";
import { MobilePost } from "./components/MobilePost";

function App() {
  const [currentView, setCurrentView] = useState<NavigationView>("home");
  const [postDetailsState, setPostDetailsState] =
    useState<PostDetailsState | null>(null);
  const { isAuthenticated } = useAuth();

  // Handle view changes and redirect unauthenticated users
  const handleViewChange = (
    view: NavigationView,
    postDetails?: PostDetailsState
  ) => {
    // Redirect to login if trying to access protected views while not authenticated
    if (!isAuthenticated && (view === "profile" || view === "settings")) {
      setCurrentView("login");
      return;
    }

    // Redirect to home if authenticated user tries to access login/signup
    if (isAuthenticated && (view === "login" || view === "signup")) {
      setCurrentView("home");
      return;
    }

    if (view === "post-details" && postDetails) {
      setPostDetailsState(postDetails);
    }

    setCurrentView(view);
  };

  // Auto-redirect to home after login
  React.useEffect(() => {
    if (
      isAuthenticated &&
      (currentView === "login" || currentView === "signup")
    ) {
      setCurrentView("home");
    }
  }, [isAuthenticated, currentView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case "home":
        return <HomeView onPostClick={handleViewChange} />;
      case "profile":
        return <ProfileView />;
      case "settings":
        return <SettingsView />;
      case "login":
        return <LoginView />;
      case "signup":
        return <SignupView />;
      case "post-details":
        return postDetailsState ? (
          <PostDetails
            author={postDetailsState.author}
            content={postDetailsState.content}
            timestamp={postDetailsState.timestamp}
            postId={postDetailsState.postId}
            postType={postDetailsState.postType}
            onBack={() => setCurrentView("home")}
            onCommentClick={handleViewChange}
          />
        ) : (
          <HomeView onPostClick={handleViewChange} />
        );
      default:
        return <HomeView onPostClick={handleViewChange} />;
    }
  };

  const renderCurrentSideView = () => {
    switch (currentView) {
      case "home":
        return <SideHomeView onPostClick={handleViewChange} />;
      case "post-details":
        return <div className="p-4 text-rixa-cream">Post Details Sidebar</div>;
      case "profile":
        return <div className="p-4 text-rixa-cream">Profile Sidebar</div>;
      case "settings":
        return <div className="p-4 text-rixa-cream">Settings Sidebar</div>;
      default:
        return null;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-rixa-dark-shadow">
        <Header
          currentView={currentView as NavigationView}
          onViewChange={handleViewChange}
        />

        <div className="flex h-[calc(99vh-64px)]">
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto border-x border-b border-rixa-blue/20 h-full flex justify-center">
              <div className="h-full w-full sm:w-2/3">
                {renderCurrentView()}
              </div>
              <div className="h-full w-1/3 border border-rixa-blue/20 border-y-0 border-l-1 border-r-0 hidden sm:block">
                {renderCurrentSideView()}
              </div>

              {isAuthenticated && currentView === "home" && (
                <div className="sm:hidden float-left fixed bottom-5 right-5">
                  <MobilePost />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// Simple SignupView component
const SignupView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20 text-center">
        <h1 className="text-2xl font-bold text-rixa-cream mb-2">
          Create Account
        </h1>
        <p className="text-rixa-cream/70">
          Join Rixa and start connecting with people around the world.
        </p>
      </div>

      {/* Add signup form here - similar to LoginForm */}
      <div className="bg-rixa-dark rounded-lg shadow-sm border border-rixa-blue/20 p-6">
        <h2 className="text-xl font-semibold text-rixa-cream mb-4">Sign Up</h2>
        <p className="text-rixa-cream/70">Signup form coming soon...</p>
      </div>
    </div>
  );
};

export default App;
