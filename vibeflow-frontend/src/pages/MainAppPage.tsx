import React from 'react';

const MainAppPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
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
              placeholder="e.g., I want to create a social media app for hikers to share photos of their favorite trails and rate them by difficulty."
            />
          </div>

          <div>
            <button
              type="submit" // Changed to submit, assuming it might be part of a form later
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
            >
              Flow
            </button>
          </div>
        </div>

        {/* Placeholder for future content - can be styled similarly when activated */}
        {/* 
        <section className="mt-12 p-6 bg-white shadow sm:rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900">Suggested Datasets</h3>
          <p className="mt-2 text-sm text-gray-600">...</p>
        </section>
        <section className="mt-8 p-6 bg-white shadow sm:rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900">Suggested Architecture</h3>
          <p className="mt-2 text-sm text-gray-600">...</p>
        </section>
        <section className="mt-8 p-6 bg-white shadow sm:rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900">API Recommendations</h3>
          <p className="mt-2 text-sm text-gray-600">...</p>
        </section>
        <div className="mt-8 space-y-4">
          <button 
            type="button"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Build My Starter Kit
          </button>
          <button 
            type="button"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Deploy to Google Cloud
          </button>
        </div>
        */}
      </div>
    </div>
  );
};

export default MainAppPage;
