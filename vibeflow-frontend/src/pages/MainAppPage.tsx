import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

// Define a basic structure for the expected API response
// Define a more specific structure for search result items
// Define a more specific structure for search result items
// Define a more specific structure for search result items
interface SearchResultItem { // This will now be specifically for Datasets
  name: string;
  description?: string;
  source_url?: string; // Specific to datasets - reverted to snake_case
  sample_data_snippet?: any;  // reverted to snake_case
  score?: number; 
  category?: string[];
  keywords?: string[]; // Added from backend projection
  potential_use_cases?: string[]; // Added from backend projection
  core_features?: string[]; 
  target_audience?: string; // Added from backend projection
  complexity_rating?: string; // Added from backend projection
  monetization_ideas?: string[]; // Added from backend projection
}

// New interface for API results
interface ApiItem {
  name: string;
  description?: string;
  documentation_url: string; // Specific to APIs
  category?: string; // Usually single for APIs in our current backend schema
  common_use_cases?: string[];
  authentication_type?: string;
  score?: number;
}

// Interface for AI-generated sample queries
interface SampleQuery {
  description: string;
  query: object;
}

interface ApiResult { // This is the overall response from /process-vibe
  message: string;
  vibeText: string;
  vibeEmbeddingDimensions?: number;
  searchResults?: SearchResultItem[]; // For datasets - Reverted to searchResults
  apiResults?: ApiItem[]; // For APIs
  aiFeedback?: string | null;
}

const MainAppPage: React.FC = () => {
  const [vibeText, setVibeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResults, setApiResults] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // State for Playground
  const [activePlaygroundItemName, setActivePlaygroundItemName] = useState<string | null>(null);
  const [sampleQueries, setSampleQueries] = useState<SampleQuery[] | null>(null);
  const [playgroundResults, setPlaygroundResults] = useState<any[] | null>(null);
  const [isLoadingPlayground, setIsLoadingPlayground] = useState(false);
  const [playgroundError, setPlaygroundError] = useState<string | null>(null);


  const handleFlowSubmit = async () => {
    if (!vibeText.trim()) {
      setError("Please describe your application idea first!");
      return;
    }
    setIsLoading(true);
    setError(null);
    setApiResults(null);
    // Reset playground state on new main flow submit
    setActivePlaygroundItemName(null);
    setSampleQueries(null);
    setPlaygroundResults(null);
    setPlaygroundError(null);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE_URL}/process-vibe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vibeText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API request failed with status ${response.status}`);
      }

      setApiResults(data);
    } catch (err: any) {
      console.error("API call error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryInPlayground = async (item: SearchResultItem) => {
    console.log(`Entering handleTryInPlayground for: ${item.name}`, item); // Log entry and the item
    if (!item.description || !item.core_features) {
      console.error("Playground pre-check failed: Missing description or core_features for item:", item);
      setPlaygroundError("Selected item is missing description or core features for playground.");
      return;
    }
    setActivePlaygroundItemName(item.name);
    setSampleQueries(null);
    setPlaygroundResults(null);
    setPlaygroundError(null);
    setIsLoadingPlayground(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE_URL}/playground/generate-queries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ideaName: item.name, 
          ideaDescription: item.description,
          coreFeatures: item.core_features 
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Failed to generate sample queries (status ${response.status})`);
      }
      setSampleQueries(data as SampleQuery[]);
    } catch (err: any) {
      console.error("Playground generate queries error:", err);
      setPlaygroundError(err.message || "Failed to fetch sample queries.");
      setSampleQueries(null); // Clear previous queries on error
    } finally {
      setIsLoadingPlayground(false);
    }
  };

  const handleExecuteSampleQuery = async (query: object) => {
    console.log("Executing sample query:", query);
    setPlaygroundResults(null); // Clear previous results
    setPlaygroundError(null);
    setIsLoadingPlayground(true); // Use the same loading state for now

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE_URL}/playground/execute-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Failed to execute sample query (status ${response.status})`);
      }
      setPlaygroundResults(data);
      console.log("Playground query results:", data);
    } catch (err: any) {
      console.error("Playground execute query error:", err);
      setPlaygroundError(err.message || "Failed to execute sample query.");
      setPlaygroundResults(null);
    } finally {
      setIsLoadingPlayground(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex justify-center mb-8">
          <img 
            src="/VibeFlow.png" 
            alt="VibeFlow Logo" 
            className="h-28 w-auto" // Adjust size as needed, e.g., h-24, h-32
          />
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Describe the application you want to build.
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Let your ideas flow, and we'll help you bring them to life.
          </p>
        </div>

        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800">
            Welcome to VibeFlow: Your Idea Co-Pilot!
          </h3>
          <p className="mt-2 text-sm text-gray-700">
            VibeFlow helps you transform your initial 'vibe' into a clear, actionable plan. 
            Instead of just generating code, we're your interactive partner to:
          </p>
          <ul className="mt-3 list-disc list-inside text-left inline-block text-sm text-gray-700 space-y-1">
            <li>
              <strong>Discover Resources:</strong> Uncover relevant public datasets and APIs with MongoDB Atlas Search.
            </li>
            <li>
              <strong>Refine Your Vision:</strong> Explore 'what if' scenarios and understand their impact.
            </li>
            <li>
              <strong>Learn As You Go:</strong> Get curated links to tutorials and docs tailored to your idea.
            </li>
            <li>
              <strong>Get a 'Vibe Check':</strong> Receive AI feedback on feasibility and potential challenges.
            </li>
          </ul>
          <p className="mt-3 text-sm text-gray-600">
            Ready to explore your idea? Let it flow below!
          </p>
          <p className="mt-4 text-sm text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200">
            <strong>Please Note:</strong> VibeFlow is currently a proof-of-concept. Our collection of curated datasets and APIs is actively growing. We appreciate your understanding as we expand our database to provide even more relevant resources for your innovative ideas!
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="vibeDescription" className="sr-only">
              Application Description
            </label>
            <textarea
              id="vibeDescription"
              name="vibeDescription"
              rows={10}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
              placeholder={`e.g.,
- I want to build an app that shows me what's trending daily in the US.
- Help me find data on rapidly growing search queries for marketing.
- I'm thinking about a skill-sharing app for local communities.
- What resources are there for an app that tracks personal reading goals?
- I want to create a guide to sustainable restaurants in my city.
- Or describe your unique app idea... what do you want to build?`}
              value={vibeText}
              onChange={(e) => setVibeText(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <button
              type="button" // Changed from "submit"
              onClick={handleFlowSubmit}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-black bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Flowing...' : 'Flow'}
            </button>
          </div>
        </div>

        {/* Results/Error Display Area */}
        <div className="mt-8">
          {isLoading && (
            <div className="text-center p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-md">
              <p>Processing your vibe... please wait.</p>
            </div>
          )}
          {error && (
            <div className="text-left p-4 bg-red-50 border border-red-300 text-red-700 rounded-md">
              <h4 className="font-bold">Error:</h4>
              <pre className="whitespace-pre-wrap">{error}</pre>
            </div>
          )}
          {apiResults && (
            <div className="relative z-1 text-left p-4 bg-green-50 border border-green-300 rounded-md space-y-4"> {/* Added relative and z-1 */}
              <h4 className="text-lg font-semibold text-green-800">VibeFlow Insights:</h4>
              <p><strong>Original Vibe:</strong> {apiResults.vibeText}</p>
              <p><strong>Message:</strong> {apiResults.message}</p>
              {apiResults.vibeEmbeddingDimensions && <p><strong>Embedding Dimensions:</strong> {apiResults.vibeEmbeddingDimensions}</p>}
              
              {apiResults.searchResults && apiResults.searchResults.length > 0 && (
                <div>
                  <h5 className="font-semibold">Suggested Datasets:</h5>
                  <ul className="space-y-3">
                    {apiResults.searchResults.map((item: SearchResultItem, index: number) => (
                      <li key={index} className="mt-1 p-3 border border-gray-200 rounded-lg bg-white shadow-sm">
                        <div className="flex justify-between items-center">
                          <h6 className="font-bold text-gray-800">{item.name}</h6>
                          <div className="relative z-10"> {/* Added relative and z-10 */}
                            {item.source_url && <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-primary hover:text-brand-secondary hover:underline mr-3">View Source</a>}
                            {item.category && item.category.includes("Playground App Idea") && (
                              <>
                                {/* Log state values right before rendering the button */}
                                {console.log(`Button render for ${item.name}: isLoadingPlayground=${isLoadingPlayground}, activePlaygroundItemName=${activePlaygroundItemName}, isDisabled=${isLoadingPlayground && activePlaygroundItemName === item.name}`)}
                                <button
                                  type="button" // Explicitly set type
                                  onClick={() => handleTryInPlayground(item)}
                                  disabled={isLoadingPlayground && activePlaygroundItemName === item.name}
                                  className="text-sm bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md transition-colors disabled:opacity-50"
                                >
                                  {isLoadingPlayground && activePlaygroundItemName === item.name ? 'Loading Queries...' : 'Try in Playground'}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{item.description?.substring(0, 250)}...</p>
                        {item.score && <p className="text-xs text-gray-500 mt-1">Relevance Score: {item.score.toFixed(4)}</p>}
                        {item.sample_data_snippet && (
                          <div className="mt-2">
                            <h6 className="text-xs font-semibold text-gray-700">Sample Data:</h6>
                            <pre className="mt-1 p-2 bg-gray-50 text-xs text-gray-700 rounded-md overflow-x-auto">
                              {typeof item.sample_data_snippet === 'object' 
                                ? JSON.stringify(item.sample_data_snippet, null, 2) 
                                : String(item.sample_data_snippet)}
                            </pre>
                          </div>
                        )}
                        {/* Display Sample Queries and Playground Results for this item */}
                        {activePlaygroundItemName === item.name && (
                          <div className="mt-3 p-3 border-t border-gray-200">
                            {isLoadingPlayground && <p className="text-sm text-blue-600">Loading sample queries...</p>}
                            {playgroundError && <p className="text-sm text-red-600">Playground Error: {playgroundError}</p>}
                            
                            {sampleQueries && sampleQueries.length > 0 && !playgroundResults && (
                              <div>
                                <h6 className="text-sm font-semibold text-gray-700 mb-2">Suggested Queries:</h6>
                                <div className="space-y-2">
                                  {sampleQueries.map((sq, sqIndex) => (
                                    <button
                                      key={sqIndex}
                                      onClick={() => handleExecuteSampleQuery(sq.query)}
                                      disabled={isLoadingPlayground}
                                      className="w-full text-left text-sm p-2 bg-indigo-100 hover:bg-indigo-200 rounded-md border border-indigo-300 disabled:opacity-70 transition-colors"
                                    >
                                      {sq.description}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                            {playgroundResults && (
                              <div className="mt-4">
                                <h6 className="text-sm font-semibold text-gray-700 mb-2">Playground Results:</h6>
                                {playgroundResults.length > 0 ? (
                                  <ul className="space-y-1">
                                    {playgroundResults.map((result: any, prIndex: number) => (
                                      <li key={prIndex} className="text-xs p-2 bg-gray-100 rounded">
                                        <strong>{result.name}</strong>
                                        {result.description && `: ${result.description.substring(0,100)}...`}
                                        {result.core_features && ` (Features: ${result.core_features.join(', ')})`}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-gray-500">No results found for this sample query.</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggested APIs Section */}
              {apiResults.apiResults && apiResults.apiResults.length > 0 && (
                <div className="mt-6"> {/* Add some margin-top if both datasets and APIs are present */}
                  <h5 className="font-semibold">Suggested APIs:</h5>
                  <ul className="space-y-3">
                    {apiResults.apiResults.map((api: ApiItem, index: number) => (
                      <li key={`api-${index}`} className="mt-1 p-3 border border-gray-200 rounded-lg bg-white shadow-sm">
                        <div className="flex justify-between items-center">
                          <h6 className="font-bold text-gray-800">{api.name}</h6>
                          {api.documentation_url && (
                            <a 
                              href={api.documentation_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm text-brand-primary hover:text-brand-secondary hover:underline"
                            >
                              View Docs
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{api.description?.substring(0, 250)}...</p>
                        {api.category && <p className="text-xs text-gray-500 mt-1">Category: {api.category}</p>}
                        {api.authentication_type && <p className="text-xs text-gray-500 mt-1">Auth: {api.authentication_type}</p>}
                        {api.common_use_cases && api.common_use_cases.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Use Cases: {api.common_use_cases.join(', ').substring(0, 100)}...
                          </p>
                        )}
                        {api.score && <p className="text-xs text-gray-500 mt-1">Relevance Score: {api.score.toFixed(4)}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {apiResults.aiFeedback && (
                 <div className="prose prose-sm max-w-none"> {/* Added Tailwind Typography for basic styling */}
                    <h5 className="font-semibold">AI Feedback:</h5>
                    <ReactMarkdown>{apiResults.aiFeedback}</ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Curated Learning Links Section */}
        <div className="mt-12 w-full max-w-2xl">
          <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
            Curated Learning Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-brand-primary">React Docs</h4>
              <p className="text-sm text-gray-600 mt-1">The official documentation for React, the library for web and native user interfaces.</p>
            </a>
            <a href="https://www.mongodb.com/docs/atlas/" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-brand-primary">MongoDB Atlas Docs</h4>
              <p className="text-sm text-gray-600 mt-1">Official documentation for MongoDB Atlas, the multi-cloud application data platform.</p>
            </a>
            <a href="https://tailwindcss.com/docs" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-brand-primary">Tailwind CSS Docs</h4>
              <p className="text-sm text-gray-600 mt-1">Documentation for Tailwind CSS, a utility-first CSS framework.</p>
            </a>
            <a href="https://nodejs.org/en/docs" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-brand-primary">Node.js Docs</h4>
              <p className="text-sm text-gray-600 mt-1">Official Node.js documentation, covering its asynchronous event-driven JavaScript runtime.</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainAppPage;
