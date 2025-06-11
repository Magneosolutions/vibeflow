import React from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MainAppPage from './pages/MainAppPage';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import from new context file
import './App.css';

// ProtectedRoute using Auth Context
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth(); // useAuth is now imported
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>; // Ensure children is treated as ReactNode
};

// 4. App component wrapped with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainAppPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NavigateToCorrectRoute />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

// Helper component to decide where to navigate for '*' route
const NavigateToCorrectRoute: React.FC = () => {
    const { isAuthenticated } = useAuth();
    return <Navigate to={isAuthenticated ? "/" : "/login"} replace />;
};

export default App;
