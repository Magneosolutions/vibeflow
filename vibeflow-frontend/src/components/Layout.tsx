import React from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth(); // Use auth context

  const handleSignOut = () => {
    logout(); // Call logout from context
    navigate('/login'); // Navigate to login after logout
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to={isAuthenticated ? "/" : "/login"} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
          VibeFlow
        </Link>
        <nav>
          {isAuthenticated ? (
            <>
              {/* Optionally show user email/name here */}
              {/* For demo, could show: <span style={{ marginRight: '1rem' }}>demo@example.com</span> */}
              <button onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </nav>
      </header>
      <main style={{ padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
