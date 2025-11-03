import React from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '../components/ui/Header';
import { LoginForm } from '../components/Login/LoginForm';
import { useAuth } from '../hooks';

export const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-rixa-dark">
      <Header />
      <div className="flex">
        <main className="flex-1">
          <div className="max-w-5xl mx-auto border-x border-b border-rixa-blue/20 h-full flex justify-center">
            <div className="h-full w-full sm:w-2/3 p-5">
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
                <p className="text-sm text-rixa-cream/60 mt-4 text-center">
                  Don't have an account?{" "}
                  <a href="/signup" className="text-rixa-blue hover:underline">
                    Sign up here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};