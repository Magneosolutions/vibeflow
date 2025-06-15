import React from 'react';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  isAuthenticated?: boolean;
  onSignOut?: () => void;
  onNavigate?: (path: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  isAuthenticated = false, 
  onSignOut = () => {}, 
  onNavigate = () => {} 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Header with vibrant gradient border */}
      <header className="relative bg-white/90 backdrop-blur-sm shadow-2xl border-b-4 border-transparent z-10">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo with animated gradient */}
            <button 
              onClick={() => onNavigate(isAuthenticated ? "/" : "/login")}
              className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent hover:from-pink-600 hover:via-blue-600 hover:to-purple-600 transition-all duration-500 transform hover:scale-110 cursor-pointer"
            >
              VibeFlow <span className="text-xs text-red-500">Vibecoder Assistant</span>
            </button>
            
            {/* Navigation with popout buttons */}
            <nav className="flex items-center space-x-6">
              {isAuthenticated ? (
                <button
                  onClick={onSignOut}
                  className="group relative px-8 py-3 text-sm font-black text-white overflow-hidden rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 group-hover:from-red-600 group-hover:via-pink-600 group-hover:to-orange-600 transition-all duration-300"></span>
                  <span className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 transition-transform duration-500"></span>
                  <span className="relative z-10">Sign Out</span>
                  <span className="absolute inset-0 rounded-full border-2 border-white/50"></span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate("/login")}
                    className="px-8 py-3 text-sm font-black text-purple-600 bg-white rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl border-3 border-purple-300 hover:border-purple-500 hover:text-purple-700"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => onNavigate("/signup")}
                    className="group relative px-8 py-3 text-sm font-black text-white overflow-hidden rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 group-hover:from-purple-600 group-hover:via-blue-600 group-hover:to-indigo-600 transition-all duration-300"></span>
                    <span className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 transition-transform duration-500"></span>
                    <span className="relative z-10">Sign Up</span>
                    <span className="absolute inset-0 rounded-full border-2 border-white/50"></span>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main content with colorful borders and shadows */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
        <div className="relative">
          {/* Decorative corner elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl opacity-40"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-2xl opacity-40"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full blur-2xl opacity-30"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-2xl opacity-30"></div>
          
          {/* Main content container */}
          <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-transparent overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 opacity-50"></div>
            <div className="absolute inset-1 bg-white rounded-3xl"></div>
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Footer with animated gradient border */}
      <footer className="relative bg-white/90 backdrop-blur-sm shadow-2xl border-t-4 border-transparent mt-12 z-10">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-lg font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              &copy; {new Date().getFullYear()} VibeFlow. All rights reserved.
            </p>
            <div className="mt-4 flex justify-center space-x-3">
              <span className="w-3 h-3 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50"></span>
              <span className="w-3 h-3 bg-pink-500 rounded-full animate-pulse shadow-lg shadow-pink-500/50" style={{animationDelay: '0.2s'}}></span>
              <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" style={{animationDelay: '0.4s'}}></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
