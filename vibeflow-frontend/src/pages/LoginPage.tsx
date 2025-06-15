import React, { useState, useEffect } from 'react'; // Added useEffect
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated } = useAuth(); // Added isAuthenticated to check login status
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      // After login, the useEffect above will handle redirection if isAuthenticated becomes true.
      // After login, the useEffect above will handle redirection if isAuthenticated becomes true.
      // If login fails, the error will be caught below.
    } catch (err: any) { // Catch block for Firebase errors
      let specificMessage = 'Login failed. Please check your credentials or try again.';
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            specificMessage = 'Invalid email or password.';
            break;
          case 'auth/invalid-email':
            specificMessage = 'The email address is not valid.';
            break;
          case 'auth/user-disabled':
            specificMessage = 'This user account has been disabled.';
            break;
          default:
            // Use the default specificMessage or Firebase's message for other errors
            specificMessage = err.message || specificMessage;
            break;
        }
      } else if (err instanceof Error) {
        specificMessage = err.message;
      }
      setError(specificMessage);
      console.error("Login submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg"> {/* Increased max-width */}
        <div className="flex justify-center mb-8">
          <img 
            src="/VibeFlow.png" 
            alt="VibeFlow Logo" 
            className="h-24 w-auto" // Adjust size as needed, e.g., h-20, h-28
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to VibeFlow
        </h2>

        {/* Enticing Description Start */}
        <div className="mt-4 text-center max-w-md mx-auto"> {/* Added container for description */}
          <h3 className="text-xl font-semibold text-brand-primary">
            Got an App Idea? Let's Vibe.
          </h3>
          <p className="mt-1 text-sm text-gray-700">
            Transform Your Spark into a Plan with VibeFlow, Your AI Co-Pilot for App Creation.
          </p>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            Are you a 'vibecoder' – an innovator, dreamer, or developer with a brilliant app concept buzzing in your mind? VibeFlow is built for you!
            Stop wondering 'what if' and start discovering 'what's next.' Simply describe your application idea, and our AI-powered platform will help you:
          </p>
          <ul className="mt-2 list-disc list-inside text-left inline-block text-sm text-gray-600 space-y-1">
            <li><strong>Uncover Hidden Gems:</strong> Find relevant public datasets and APIs.</li>
            <li><strong>Refine Your Vision:</strong> Get intelligent feedback and explore new angles.</li>
            <li><strong>Learn & Grow:</strong> Access curated learning resources.</li>
            <li><strong>Plan with Confidence:</strong> Move from raw idea to an actionable roadmap.</li>
          </ul>
          <p className="mt-2 text-sm text-gray-600">
            VibeFlow doesn't just write code; it empowers you with insights. Sign up or log in to start flowing your ideas into reality!
          </p>
        </div>
        {/* Enticing Description End */}

        {/* Link to Sign Up page */}
        <p className="mt-8 text-center text-sm text-gray-600"> {/* Increased mt for spacing */}
          Or{' '}
          <Link to="/signup" className="font-medium text-brand-primary hover:text-brand-secondary">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg"> {/* Increased max-width */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10"> {/* Increased rounding */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md"> {/* Ensured error box is also rounded */}
              <h3 className="font-bold">Error</h3>
              <p>{error}</p>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
