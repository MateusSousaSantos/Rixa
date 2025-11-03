import React from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '../components/ui/Header';
import { SignUpForm } from '../components/SignUp/SignUpForm';
import { useAuth } from '../hooks';

export const SignUpPage: React.FC = () => {
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
                    Join RIXA!
                  </h1>
                  <p className="text-rixa-cream/70">
                    Create your account and start connecting with people around the world.
                  </p>
                </div>
                <SignUpForm />
                <p className="text-sm text-rixa-cream/60 mt-4 text-center">
                  Already have an account?{" "}
                  <a href="/login" className="text-rixa-blue hover:underline">
                    Login here
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