import React, { useState } from "react";
import {
  Header,
  HomeView,
  ProfileView,
  SettingsView,
  LoginView,
} from "./components";
import type { NavigationView } from "./components";
import { useAuth } from "./hooks";
import { SideHomeView } from "./components/SideHomeView";

function App() {
  const [currentView, setCurrentView] = useState<NavigationView>("home");
  const { isAuthenticated } = useAuth();

  // Handle view changes and redirect unauthenticated users
  // const handleViewChange = (view: NavigationView) => {
  //   // Redirect to login if trying to access protected views while not authenticated
  //   if (!isAuthenticated && (view === "profile" || view === "settings")) {
  //     setCurrentView("login");
  //     return;
  //   }

  //   // Redirect to home if authenticated user tries to access login
  //   if (isAuthenticated && view === "login") {
  //     setCurrentView("home");
  //     return;
  //   }

  //   setCurrentView(view);
  // };

  // Auto-redirect to home after login
  React.useEffect(() => {
    if (isAuthenticated && currentView === "login") {
      setCurrentView("home");
    }
  }, [isAuthenticated, currentView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case "home":
        return <HomeView />;
      case "profile":
        return <ProfileView />;
      case "settings":
        return <SettingsView />;
      case "login":
        return <LoginView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-rixa-dark-shadow">
      <Header />

      <div className="flex h-[calc(99vh-64px)]">
        {/* <Navigation currentView={currentView} onViewChange={handleViewChange} /> */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto border-x border-b border-rixa-blue/20 h-full flex justify-center">
            <div className="h-full w-full sm:w-2/3">{renderCurrentView()}</div>
            <div className="h-full w-1/3 border border-rixa-blue/20 border-y-0 border-l-1 border-r-0 hidden sm:block">
              <SideHomeView />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
