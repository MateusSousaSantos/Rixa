import React from "react";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../hooks";
import { IoInformationCircle } from "react-icons/io5";
import { IoLogIn } from "react-icons/io5";
import { BsFillSignIntersectionFill } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-rixa-dark shadow-sm border-b border-rixa-blue/20">
      <div className="max-w-4xl mx-auto px-4 py-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="hidden md:block text-[40px] font-bold font-koulen text-rixa-cream tracking-wide hover:text-rixa-blue transition-colors"
            >
              RIXA!
            </Link>
            <Link 
              to="/" 
              className="md:hidden text-[32px] font-bold font-koulen text-rixa-cream tracking-wide hover:text-rixa-blue transition-colors"
            >
              RX
            </Link>
          </div>

          <nav className="hidden md:block">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-rixa-cream cursor-pointer hover:text-rixa-blue transition-colors"
                >
                  <div className="w-8 h-8 bg-rixa-blue rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.nome.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">{user.nome}</span>
                </Link>

                {/* <Link
                  to="/settings"
                  className={`flex items-center gap-2 px-3 py-2 text-rixa-cream hover:text-rixa-blue transition-colors ${
                    isActive("/settings") ? "text-rixa-blue" : ""
                  }`}
                >
                  <FiSettings size={16} />
                  <span className="hidden sm:inline">Settings</span>
                </Link> */}

                <button
                  onClick={handleLogout}
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
                  <Link
                    to="/login"
                    className={`font-bold text-rixa-cream text-lg hover:text-rixa-blue transition-colors ${
                      isActive("/login") ? "text-rixa-blue" : ""
                    }`}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/signup"
                    className={`bg-rixa-blue p-1 px-2 rounded font-bold text-lg hover:bg-rixa-blue/80 transition-colors ${
                      isActive("/signup") ? "bg-rixa-blue/80" : ""
                    }`}
                  >
                    Criar
                  </Link>
                </div>
                {/* Botões compactos - visíveis apenas em telas pequenas */}
                <div className="sm:hidden flex items-center gap-1">
                  <Link
                    to="/login"
                    className={`font-bold text-rixa-cream text-sm px-2 py-1 hover:text-rixa-blue transition-colors ${
                      isActive("/login") ? "text-rixa-blue" : ""
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={`bg-rixa-blue px-2 py-1 rounded font-bold text-sm hover:bg-rixa-blue/80 transition-colors ${
                      isActive("/signup") ? "bg-rixa-blue/80" : ""
                    }`}
                  >
                    +
                  </Link>
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
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-rixa-cream cursor-pointer hover:text-rixa-blue transition-colors"
                >
                  <div className="w-8 h-8 bg-rixa-blue rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.nome.charAt(0).toUpperCase() || "U"}
                  </div>
                </Link>
                {/* <Link
                  to="/settings"
                  className={`flex items-center gap-2 px-3 py-2 text-rixa-cream hover:text-rixa-blue transition-colors ${
                    isActive("/settings") ? "text-rixa-blue" : ""
                  }`}
                >
                  <FiSettings size={16} />
                </Link> */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-rixa-cream hover:text-rixa-red transition-colors"
                >
                  <FiLogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-rixa-cream">
                <FiUser size={20} />

                <div className="flex gap-3">
                  <Link
                    to="/login"
                    className={`text-rixa-cream hover:text-rixa-blue transition-colors flex items-center ${
                      isActive("/login") ? "text-rixa-blue" : ""
                    }`}
                  >
                    <IoLogIn size={35}/>
                  </Link>
                  <Link
                    to="/signup"
                    className={`bg-rixa-blue p-1 px-2 rounded font-bold text-lg hover:bg-rixa-blue/80 transition-colors ${
                      isActive("/signup") ? "bg-rixa-blue/80" : ""
                    }`}
                  >
                    <BsFillSignIntersectionFill />
                  </Link>
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