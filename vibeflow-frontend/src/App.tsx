import React from 'react';
// import type { ReactNode } from 'react'; // Removed unused import
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // Added useNavigate
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MainAppPage from './pages/MainAppPage';
import AboutPage from './pages/AboutPage'; // Import the new AboutPage
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

// New AppContent component to use hooks and pass props to Layout
const AppContent: React.FC = () => {
  const { isAuthenticated, logout, loadingAuth } = useAuth(); // Removed currentUser as it's not used yet
  const navigate = useNavigate();

  const handleSignOut = async () => { // Made async
    try {
      await logout(); // Call logout from context and await it
      navigate('/login'); // Navigate to login after logout
    } catch (error) {
      console.error("Sign out error:", error);
      // Optionally, display an error to the user
    }
  };

  if (loadingAuth) {
    // You can replace this with a more sophisticated loading spinner/component
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading application...</div>
      </div>
    );
  }

  return (
    <Layout
      isAuthenticated={isAuthenticated}
      onSignOut={handleSignOut}
      onNavigate={navigate}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/about" element={<AboutPage />} /> {/* Add route for AboutPage */}
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
  );
};

// App component wrapped with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

// Helper component to decide where to navigate for '*' route
const NavigateToCorrectRoute: React.FC = () => {
    const { isAuthenticated, loadingAuth } = useAuth(); // Added loadingAuth

    if (loadingAuth) {
      // Important: Don't navigate until auth state is known
      return null; // Or a loading indicator
    }
    return <Navigate to={isAuthenticated ? "/" : "/login"} replace />;
};

export default App;
