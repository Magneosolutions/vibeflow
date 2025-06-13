import React, { useState } from 'react';

// Define a basic structure for the expected API response
interface ApiResult {
  message: string;
  vibeText: string;
  vibeEmbeddingDimensions?: number;
  searchResults?: any[]; // Define more specifically based on DatasetDocument later
  aiFeedback?: string | null;
}

const MainAppPage: React.FC = () => {
  const [vibeText, setVibeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResults, setApiResults] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFlowSubmit = async () => {
    if (!vibeText.trim()) {
      setError("Please describe your application idea first!");
      return;
    }
    setIsLoading(true);
    setError(null);
    setApiResults(null);

    try {
      // Assuming backend runs on port 3001 as per .env
      // For development, you might need to configure Vite proxy or ensure backend CORS allows frontend origin
      const response = await fetch('http://localhost:3001/api/process-vibe', {
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
- I need a dataset of top rising Google search terms to understand public interest.
- Show me data sources for SEO keyword research based on daily trends.
- What public datasets are available for analyzing trending topics in different US regions?
Or describe your unique app idea...`}
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
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors disabled:opacity-50"
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
            <div className="text-left p-4 bg-green-50 border border-green-300 rounded-md space-y-4">
              <h4 className="text-lg font-semibold text-green-800">VibeFlow Insights:</h4>
              <p><strong>Original Vibe:</strong> {apiResults.vibeText}</p>
              <p><strong>Message:</strong> {apiResults.message}</p>
              {apiResults.vibeEmbeddingDimensions && <p><strong>Embedding Dimensions:</strong> {apiResults.vibeEmbeddingDimensions}</p>}
              
              {apiResults.searchResults && apiResults.searchResults.length > 0 && (
                <div>
                  <h5 className="font-semibold">Suggested Datasets:</h5>
                  <ul className="list-disc list-inside pl-4">
                    {apiResults.searchResults.map((item: any, index: number) => (
                      <li key={index} className="mt-1 p-2 border rounded bg-white">
                        <strong>{item.name}</strong>: {item.description?.substring(0, 150)}...
                        {item.source_url && <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline ml-2">Source</a>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {apiResults.aiFeedback && (
                 <div>
                    <h5 className="font-semibold">AI Feedback:</h5>
                    <p className="whitespace-pre-wrap">{apiResults.aiFeedback}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainAppPage;
