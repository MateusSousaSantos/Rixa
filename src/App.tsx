import React, { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Header,
  HomeView,
  ProfileView,
  SettingsView,
  LoginView,
  PostDetails,
  UserProfileView,
} from "./components";
import { useAuth } from "./hooks";
import { SideHomeView } from "./components/SideHomeView";
import type { NavigationView } from "./types/navigation";
import type { PostDetailsState, UserProfileState } from "./types/navigation";
import { queryClient } from "./lib/queryClient";
import { MobilePost } from "./components/Posts/MobilePost";
import { SideProfileView } from "./components/Profile/SideProfileView";

// Constants for localStorage keys
const STORAGE_KEYS = {
  CURRENT_VIEW: 'rixa_current_view',
  POST_DETAILS: 'rixa_post_details',
  USER_DETAILS: 'rixa_user_details'
} as const;

// Valid navigation views
const VALID_VIEWS: NavigationView[] = ['home', 'profile', 'settings', 'login', 'signup', 'post-details', 'user-profile'];

// Helper function to validate and get saved view
const getSavedView = (): NavigationView => {
  try {
    const savedView = localStorage.getItem(STORAGE_KEYS.CURRENT_VIEW);
    if (savedView && VALID_VIEWS.includes(savedView as NavigationView)) {
      return savedView as NavigationView;
    }
  } catch (error) {
    console.warn('Failed to read from localStorage:', error);
  }
  return "home";
};

// Helper function to get saved post details
const getSavedPostDetails = (): PostDetailsState | null => {
  try {
    const savedPostDetails = localStorage.getItem(STORAGE_KEYS.POST_DETAILS);
    if (savedPostDetails) {
      const parsed = JSON.parse(savedPostDetails);
      if (parsed && parsed.author && parsed.content && parsed.postId) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to read post details from localStorage:', error);
  }
  return null;
};

// Helper function to get saved user details
const getSavedUserDetails = (): UserProfileState | null => {
  try {
    const savedUserDetails = localStorage.getItem(STORAGE_KEYS.USER_DETAILS);
    if (savedUserDetails) {
      const parsed = JSON.parse(savedUserDetails);
      if (parsed && parsed.username) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to read user details from localStorage:', error);
  }
  return null;
};

function App() {
  const [currentView, setCurrentView] = useState<NavigationView>(getSavedView);
  const [postDetailsState, setPostDetailsState] = useState<PostDetailsState | null>(getSavedPostDetails);
  const [userDetailsState, setUserDetailsState] = useState<UserProfileState | null>(getSavedUserDetails);
  const { isAuthenticated } = useAuth();

  // Save current view to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_VIEW, currentView);
    } catch (error) {
      console.warn('Failed to save view to localStorage:', error);
    }
  }, [currentView]);

  // Save post details to localStorage whenever they change
  useEffect(() => {
    try {
      if (postDetailsState) {
        localStorage.setItem(STORAGE_KEYS.POST_DETAILS, JSON.stringify(postDetailsState));
      } else {
        localStorage.removeItem(STORAGE_KEYS.POST_DETAILS);
      }
    } catch (error) {
      console.warn('Failed to save post details to localStorage:', error);
    }
  }, [postDetailsState]);

  // Save user details to localStorage whenever they change
  useEffect(() => {
    try {
      if (userDetailsState) {
        localStorage.setItem(STORAGE_KEYS.USER_DETAILS, JSON.stringify(userDetailsState));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER_DETAILS);
      }
    } catch (error) {
      console.warn('Failed to save user details to localStorage:', error);
    }
  }, [userDetailsState]);

  // Handle authentication state changes
  useEffect(() => {
    if (!isAuthenticated && (currentView === "profile" || currentView === "settings")) {
      setCurrentView("home");
      setPostDetailsState(null);
      setUserDetailsState(null);
      return;
    }
    
    if (isAuthenticated && (currentView === "login" || currentView === "signup")) {
      setCurrentView("home");
      setPostDetailsState(null);
      setUserDetailsState(null);
      return;
    }
  }, [isAuthenticated, currentView]);

  // Handle view changes
  const handleViewChange = (
    view: NavigationView,
    postDetails?: PostDetailsState,
    userDetails?: UserProfileState
  ) => {
    if (!isAuthenticated && (view === "profile" || view === "settings")) {
      setCurrentView("login");
      setPostDetailsState(null);
      setUserDetailsState(null);
      return;
    }

    if (isAuthenticated && (view === "login" || view === "signup")) {
      setCurrentView("home");
      setPostDetailsState(null);
      setUserDetailsState(null);
      return;
    }

    if (view === "post-details" && postDetails) {
      setPostDetailsState(postDetails);
      setUserDetailsState(null);
    } else if (view === "user-profile" && userDetails) {
      setUserDetailsState(userDetails);
      setPostDetailsState(null);
    } else if (view !== "post-details" && view !== "user-profile") {
      setPostDetailsState(null);
      setUserDetailsState(null);
    }

    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "home":
        return (
          <HomeView 
            onPostClick={(view, postDetails) => handleViewChange(view, postDetails)}
            onUserClick={(view, userDetails) => handleViewChange(view, undefined, userDetails)}
          />
        );
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
            onBack={() => handleViewChange("home")}
            onCommentClick={(view, postDetails) => handleViewChange(view, postDetails)}
          />
        ) : (
          <HomeView 
            onPostClick={(view, postDetails) => handleViewChange(view, postDetails)}
            onUserClick={(view, userDetails) => handleViewChange(view, undefined, userDetails)}
          />
        );
      case "user-profile":
        return userDetailsState ? (
          <UserProfileView
            userDetails={userDetailsState}
            onBack={() => handleViewChange("home")}
          />
        ) : (
          <HomeView 
            onPostClick={(view, postDetails) => handleViewChange(view, postDetails)}
            onUserClick={(view, userDetails) => handleViewChange(view, undefined, userDetails)}
          />
        );
      default:
        return (
          <HomeView 
            onPostClick={(view, postDetails) => handleViewChange(view, postDetails)}
            onUserClick={(view, userDetails) => handleViewChange(view, undefined, userDetails)}
          />
        );
    }
  };

  const renderCurrentSideView = () => {
    switch (currentView) {
      case "home":
        return (
          <SideHomeView 
            onUserClick={(view, userDetails) => handleViewChange(view, undefined, userDetails)}
          />
        );
      case "post-details":
        return <div className="p-4 text-rixa-cream">Post Details Sidebar</div>;
      case "profile":
      case "user-profile":
        return <SideProfileView />;
      case "settings":
        return (
          <div className="p-5">
            <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
              <h1 className="text-2xl font-bold text-rixa-cream mb-2">
                Settings
              </h1>
              <p className="text-rixa-cream/70">
                Customize sua experiência no RIXA!
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-rixa-dark-shadow">
        <Header
          currentView={currentView}
          onViewChange={(view) => handleViewChange(view)}
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

// SignupView component
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

      <div className="bg-rixa-dark rounded-lg shadow-sm border border-rixa-blue/20 p-6">
        <h2 className="text-xl font-semibold text-rixa-cream mb-4">Sign Up</h2>
        <p className="text-rixa-cream/70">Signup form coming soon...</p>
      </div>
    </div>
  );
};

export default App;