import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Header,
  HomeView,
  ProfileView,
  SettingsView,
  LoginForm,
  SignUpForm,
  AuthInterceptorProvider,
  ToastContainer,
  UserProfileByUsername
} from "./components";
import { PostDetails } from "./components/posts/PostDetails";
import { useAuth } from "./hooks";
import { SideHomeView } from "./components/views/SideHomeView";
import { queryClient } from "./lib/queryClient";
import { MobilePost } from "./components/posts/MobilePost";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-rixa-dark-shadow">
      <Header />
      
      <div className="flex h-[calc(99vh-64px)]">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto border-x border-b border-rixa-blue/20 h-full flex justify-center">
            <div className="h-full w-full sm:w-2/3">
              {children}
            </div>
            <div className="h-full w-1/3 border border-rixa-blue/20 border-y-0 border-l-1 border-r-0 hidden sm:block">
              <AppSidebar />
            </div>

            {isAuthenticated && (
              <div className="sm:hidden float-left fixed bottom-5 right-5">
                <MobilePost />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Sidebar component
const AppSidebar: React.FC = () => {
  return <SideHomeView />;
};

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route component (redirect to home if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Page wrapper components
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handlePostClick = (view: string, postDetails?: any) => {
    if (view === 'post-details' && postDetails?.postId) {
      navigate(`/post/${postDetails.postId}`);
    }
  };

  const handleUserClick = (view: string, userDetails?: any) => {
    if (view === 'user-profile' && userDetails?.username) {
      navigate(`/user/${userDetails.username}`);
    }
  };

  return (
    <AppLayout>
      <HomeView 
        onPostClick={handlePostClick}
        onUserClick={handleUserClick}
      />
    </AppLayout>
  );
};

const ProfilePage: React.FC = () => (
  <AppLayout>
    <ProtectedRoute>
      <ProfileView />
    </ProtectedRoute>
  </AppLayout>
);

const SettingsPage: React.FC = () => (
  <AppLayout>
    <ProtectedRoute>
      <SettingsView />
    </ProtectedRoute>
  </AppLayout>
);

const LoginPage: React.FC = () => (
  <AppLayout>
    <PublicRoute>
      <div className="space-y-6">
        <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20 text-center">
          <h1 className="text-2xl font-bold text-rixa-cream mb-2">
            Welcome Back!
          </h1>
          <p className="text-rixa-cream/70">
            Login to your RIXA account.
          </p>
        </div>
        <LoginForm />
      </div>
    </PublicRoute>
  </AppLayout>
);

const SignUpPage: React.FC = () => (
  <AppLayout>
    <PublicRoute>
      <div className="space-y-6">
        <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20 text-center">
          <h1 className="text-2xl font-bold text-rixa-cream mb-2">
            Join RIXA!
          </h1>
          <p className="text-rixa-cream/70">
            Create your account and start connecting with people around the world.
          </p>
        </div>
        <SignUpForm />
      </div>
    </PublicRoute>
  </AppLayout>
);

// Post Details Page
const PostDetailsPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleCommentClick = (view: string, postDetails?: any) => {
    if (view === 'post-details' && postDetails?.postId) {
      navigate(`/post/${postDetails.postId}`);
    }
  };

  return (
    <AppLayout>
      <PostDetails 
        postId={postId ? parseInt(postId) : 0}
        onBack={handleBack}
        onCommentClick={handleCommentClick}
      />
    </AppLayout>
  );
};

// User Profile Page
const UserProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  if (!username) {
    return (
      <AppLayout>
        <div className="p-5">
          <div className="bg-rixa-dark rounded-lg p-8 border border-rixa-blue/20 text-center">
            <p className="text-rixa-red">Nome de usuário não fornecido</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <UserProfileByUsername 
        username={username}
        onBack={handleBack}
      />
    </AppLayout>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthInterceptorProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/post/:postId" element={<PostDetailsPage />} />
            <Route path="/user/:username" element={<UserProfilePage />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthInterceptorProvider>
      </Router>
      <ToastContainer />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;