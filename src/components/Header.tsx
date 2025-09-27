import React from "react";
import { FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { useAuth } from "../hooks";
import { IoInformationCircle } from "react-icons/io5";
import type { NavigationView } from "../types/navigation";
import { IoLogIn } from "react-icons/io5";
import { BsFillSignIntersectionFill } from "react-icons/bs";

interface HeaderProps {
  title?: string;
  currentView: NavigationView;
  onViewChange: (view: NavigationView) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
}) => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleCreateAccount = () => {
    onViewChange("signup");
  };

  const handleLogin = () => {
    onViewChange("login");
  };

  const handleProfile = () => {
    onViewChange("profile");
  };

  const handleSettings = () => {
    onViewChange("settings");
  };

  const handleHome = () => {
    onViewChange("home");
  };

  return (
    <header className="bg-rixa-dark shadow-sm border-b border-rixa-blue/20">
      <div className="max-w-4xl mx-auto px-4 py-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1
              className="hidden md:block text-[40px] font-bold font-koulen text-rixa-cream tracking-wide cursor-pointer"
              onClick={handleHome}
            >
              RIXA!
            </h1>
            <h1
              className="md:hidden text-[32px] font-bold font-koulen text-rixa-cream tracking-wide cursor-pointer"
              onClick={handleHome}
            >
              RX
            </h1>
          </div>

          <nav className="hidden md:block">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center gap-2 text-rixa-cream cursor-pointer hover:text-rixa-blue transition-colors"
                  onClick={handleProfile}
                >
                  <div className="w-8 h-8 bg-rixa-blue rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">{user.displayName}</span>
                </div>

                <button
                  onClick={handleSettings}
                  className={`flex items-center gap-2 px-3 py-2 text-rixa-cream hover:text-rixa-blue transition-colors ${
                    currentView === "settings" ? "text-rixa-blue" : ""
                  }`}
                >
                  <FiSettings size={16} />
                  <span className="hidden sm:inline">Settings</span>
                </button>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 text-rixa-cream hover:text-rixa-red transition-colors"
                >
                  <FiLogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-rixa-cream">
                <FiUser size={20} />
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    className={`font-bold text-rixa-cream text-lg hover:text-rixa-blue transition-colors ${
                      currentView === "login" ? "text-rixa-blue" : ""
                    }`}
                    onClick={handleLogin}
                  >
                    Entrar
                  </button>
                  <button
                    className={`bg-rixa-blue p-1 px-2 rounded font-bold text-lg hover:bg-rixa-blue/80 transition-colors ${
                      currentView === "signup" ? "bg-rixa-blue/80" : ""
                    }`}
                    onClick={handleCreateAccount}
                  >
                    Criar
                  </button>
                </div>
                {/* Botões compactos - visíveis apenas em telas pequenas */}
                <div className="sm:hidden flex items-center gap-1">
                  <button
                    className={`font-bold text-rixa-cream text-sm px-2 py-1 hover:text-rixa-blue transition-colors ${
                      currentView === "login" ? "text-rixa-blue" : ""
                    }`}
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                  <button
                    className={`bg-rixa-blue px-2 py-1 rounded font-bold text-sm hover:bg-rixa-blue/80 transition-colors ${
                      currentView === "signup" ? "bg-rixa-blue/80" : ""
                    }`}
                    onClick={handleCreateAccount}
                  >
                    +
                  </button>
                </div>
                <IoInformationCircle
                  size={25}
                  color="#00A8FF"
                  className="cursor-pointer"
                />
              </div>
            )}
          </nav>
          <div className="md:hidden">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center gap-2 text-rixa-cream cursor-pointer hover:text-rixa-blue transition-colors"
                  onClick={handleProfile}
                >
                  <div className="w-8 h-8 bg-rixa-blue rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.displayName.charAt(0).toUpperCase() || "U"}
                  </div>
                </div>
                <button
                  onClick={handleSettings}
                  className={`flex items-center gap-2 px-3 py-2 text-rixa-cream hover:text-rixa-blue transition-colors ${
                    currentView === "settings" ? "text-rixa-blue" : ""
                  }`}
                >
                  <FiSettings size={16} />
                  <span className="hidden sm:inline">Settings</span>
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2  text-rixa-cream hover:text-rixa-red transition-colors"
                >
                  <FiLogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-rixa-cream">
                <FiUser size={20} />

                <div className="flex gap-3">
                  <button
                    className={`text-rixa-cream hover:text-rixa-blue transition-colors flex items-center`}
                    onClick={handleLogin}
                  >
                    <IoLogIn size={35}/>
                  </button>
                  <button
                    className={`bg-rixa-blue p-1 px-2 rounded font-bold text-lg hover:bg-rixa-blue/80 transition-colors ${
                      currentView === "signup" ? "bg-rixa-blue/80" : ""
                    }`}
                    onClick={handleCreateAccount}
                  >
                    <BsFillSignIntersectionFill />
                  </button>
                </div>
                <IoInformationCircle
                  size={25}
                  color="#00A8FF"
                  className="cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
