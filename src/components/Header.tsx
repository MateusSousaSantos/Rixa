import React from "react";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../hooks";
import { IoInformationCircle } from "react-icons/io5";

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-rixa-dark shadow-sm border-b border-rixa-blue/20">
      <div className="max-w-4xl mx-auto px-4 py-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-[40px] font-bold font-koulen text-rixa-cream tracking-wide cursor-pointer">
              RIXA!
            </h1>
          </div>

          <nav>
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-rixa-cream">
                  <div className="w-8 h-8 bg-rixa-blue rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">{user.displayName}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 text-rixa-cream hover:text-rixa-blue transition-colors"
                >
                  <FiLogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-rixa-cream">
                <FiUser size={20} />
                <button className="font-bold text-rixa-cream text-lg">
                  Entrar
                </button>
                <button className="bg-rixa-blue p-1 px-2 rounded font-bold text-lg">
                  Criar
                </button>
                <IoInformationCircle size={25} color="#00A8FF" className="cursor-pointer"/>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
