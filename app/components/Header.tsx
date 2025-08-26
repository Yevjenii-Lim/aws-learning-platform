'use client';
import { useState } from 'react';
import { Search, Gamepad2, Settings, LogIn, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ClientOnly from './ClientOnly';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import UserMenu from './UserMenu';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backUrl?: string;
  showSearch?: boolean;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchResults?: number;
  showGamesButton?: boolean;
  showAdminButton?: boolean;
  customActions?: React.ReactNode;
}

export default function Header({
  title = "AWS Learning Platform",
  subtitle = "Interactive learning with visualizations and step-by-step guides",
  showBackButton = false,
  backUrl = "/",
  showSearch = false,
  searchTerm = "",
  onSearchChange,
  searchResults = 0,
  showGamesButton = true,
  showAdminButton = true,
  customActions
}: HeaderProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { user } = useAuth();

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              {showBackButton && (
                <Link href={backUrl} className="text-gray-600 hover:text-gray-900 mr-4">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              )}
              <div className="text-3xl mr-3">☁️</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600">{subtitle}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {showSearch && onSearchChange && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search topics"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                  <ClientOnly>
                    {searchTerm && searchResults > 0 && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        {searchResults} results
                      </div>
                    )}
                  </ClientOnly>
                </div>
              )}
              
              {customActions}
              
              {showGamesButton && (
                <Link href="/games" className="aws-button flex items-center">
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  Games
                </Link>
              )}
              
              {user ? (
                <UserMenu />
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="aws-button flex items-center"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </button>
                  <button
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="px-4 py-2 border border-aws-orange text-aws-orange rounded-lg hover:bg-aws-orange hover:text-white transition-colors"
                  >
                    Register
                  </button>
                </div>
              )}
              
              {showAdminButton && (
                <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                  <Settings className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}
