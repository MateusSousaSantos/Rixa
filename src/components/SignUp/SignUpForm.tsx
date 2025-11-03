import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks";
import { useToast } from "../../contexts/ToastContext";

export const SignUpForm: React.FC = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUsernameCustomized, setIsUsernameCustomized] = useState(false);
  const { register, isLoading } = useAuth();
  const { showError, showSuccess } = useToast();

  // 🎯 GERAR USERNAME AUTOMATICAMENTE A PARTIR DO NOME (APENAS SUGESTÃO)
  useEffect(() => {
    if (name && !isUsernameCustomized) {
      // Remove espaços, acentos e converte para minúsculas
      const generatedUsername = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/\s+/g, "") // Remove espaços
        .replace(/[^a-z0-9]/g, ""); // Remove caracteres especiais
      
      setUsername(generatedUsername);
      console.log(" Username sugerido:", generatedUsername);
    }
  }, [name, isUsernameCustomized]);

  // Quando o usuário começar a digitar manualmente, para de gerar automaticamente
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (e.target.value !== "") {
      setIsUsernameCustomized(true);
    }
  };

  // Botão para usar a sugestão automática
  const useSuggestedUsername = () => {
    const suggestedUsername = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");
    
    setUsername(suggestedUsername);
    setIsUsernameCustomized(false);
  };

  const clearForm = () => {
    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsUsernameCustomized(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSignUpError("");
    setIsSuccess(false);

    // validações básicas
    if (password !== confirmPassword) {
      showError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      showError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Por favor, insira um endereço de email válido");
      return;
    }

    // Validação do username
    if (username.length < 3) {
      showError("O nome de usuário deve ter pelo menos 3 caracteres");
      return;
    }

    const usernameRegex = /^[a-z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      showError("O nome de usuário pode conter apenas letras minúsculas, números e underscores");
      return;
    }

    if (name && username && email && password) {
      try {
        await register(name, username, email, password);
        clearForm();
        setIsSuccess(true);
        showSuccess("Conta criada com sucesso!");
      } catch (error) {
        console.error('Erro no register:', error);
        showError("Falha ao criar conta. Tente novamente.");
      }
    }
  };

  return (
    <div className="bg-rixa-dark rounded-lg shadow-sm border border-rixa-blue/20 p-6 mb-6 relative">
      {/* ALERTA DE SUCESSO */}
      {isSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-rixa-green text-rixa-cream px-6 py-4 rounded-lg shadow-lg border border-rixa-green/30">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-rixa-blue rounded-full flex items-center justify-center">
                <span className="text-rixa-green text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-semibold">Success!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold text-rixa-cream mb-4">
        Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NOME */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-rixa-cream mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 bg-rixa-dark-shadow border rounded-md 
              ${signUpError.includes("Name") ? "border-rixa-red" : "border-rixa-blue/20"} 
              focus:outline-none focus:ring-2 focus:ring-rixa-blue text-rixa-cream placeholder-rixa-cream/50`}
            placeholder="Enter your full name"
            disabled={isLoading}
          />
        </div>

        {/* USERNAME */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-rixa-cream"
            >
              Username
            </label>
            {name && isUsernameCustomized && (
              <button
                type="button"
                onClick={useSuggestedUsername}
                className="text-xs text-rixa-blue hover:text-rixa-blue/80 transition-colors"
              >
                Use suggested username
              </button>
            )}
          </div>
          
          <div className="relative">
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              className={`w-full px-3 py-2 bg-rixa-dark-shadow border rounded-md 
                ${signUpError.includes("Username") ? "border-rixa-red" : "border-rixa-blue/20"} 
                focus:outline-none focus:ring-2 focus:ring-rixa-blue text-rixa-cream placeholder-rixa-cream/50`}
              placeholder="Choose your username"
              disabled={isLoading}
            />
          </div>
          
          <p className="text-xs text-rixa-cream/60 mt-1">
            {isUsernameCustomized 
              ? "Your custom username" 
              : "Suggested based on your name. You can change it."}
          </p>
        </div>

        {/* EMAIL */}
        <div>
          <label
            htmlFor="signup-email"
            className="block text-sm font-medium text-rixa-cream mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="signup-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 bg-rixa-dark-shadow border rounded-md 
              ${signUpError.includes("email") ? "border-rixa-red" : "border-rixa-blue/20"} 
              focus:outline-none focus:ring-2 focus:ring-rixa-blue text-rixa-cream placeholder-rixa-cream/50`}
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>

        {/* SENHA */}
        <div>
          <label
            htmlFor="signup-password"
            className="block text-sm font-medium text-rixa-cream mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="signup-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-3 py-2 bg-rixa-dark-shadow border rounded-md 
              ${signUpError.includes("Password") ? "border-rixa-red" : "border-rixa-blue/20"} 
              focus:outline-none focus:ring-2 focus:ring-rixa-blue text-rixa-cream placeholder-rixa-cream/50`}
            placeholder="Enter your password (min. 6 characters)"
            disabled={isLoading}
          />
        </div>

        {/* CONFIRMAR SENHA */}
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-rixa-cream mb-1"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-3 py-2 bg-rixa-dark-shadow border rounded-md 
              ${signUpError.includes("match") ? "border-rixa-red" : "border-rixa-blue/20"} 
              focus:outline-none focus:ring-2 focus:ring-rixa-blue text-rixa-cream placeholder-rixa-cream/50`}
            placeholder="Confirm your password"
            disabled={isLoading}
          />
        </div>

        {/* BOTÃO */}
        <button
          type="submit"
          disabled={
            isLoading || !name || !username || !email || !password || !confirmPassword
          }
          className="w-full bg-rixa-blue text-white py-2 px-4 rounded-md hover:bg-rixa-blue/90 focus:outline-none focus:ring-2 focus:ring-rixa-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
      

      <p className="text-sm text-rixa-cream/60 mt-4">
        Already have an account?
        <a href="/login" className="text-rixa-blue hover:underline">
          Login here
        </a>
      </p>
    </div>
  );
};