import React from "react";
import { useAuth } from "../../hooks";

export const SideProfileView: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="bg-rixa-dark rounded-lg p-8 border border-rixa-blue/20">
          <h2 className="text-xl font-semibold text-rixa-cream mb-4">
            Profile Access Required
          </h2>
          <p className="text-rixa-cream/70">
            Please log in to view and edit your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-4">
      <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
        <h1 className="text-2xl font-bold text-rixa-cream mb-2">
          Seu perfil
        </h1>
        <p className="text-rixa-cream/70">
          Gerencie suas informações pessoais e preferências.
        </p>
      </div>
    </div>
  );
};
