import React from "react";
import { LoginForm } from "./LoginForm";

export const LoginView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20 text-center">
        <h1 className="text-2xl font-bold text-rixa-cream mb-2">
          Bem vindo ao RIXA!
        </h1>
        <p className="text-rixa-cream/70">
          Junte-se à nossa comunidade e comece a se conectar com pessoas ao
          redor do mundo.
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
  );
};
