import React from 'react';

const FAQPage: React.FC = () => {
  const faqs = [
    {
      question: "What is VibeFlow?",
      answer: "VibeFlow is an interactive AI-powered platform designed for \"vibecoders\" – individuals with application ideas. It helps you refine your concepts, discover relevant public datasets and APIs, get AI-driven feedback, and find learning resources to turn your initial 'vibe' into an actionable plan. We leverage the powerful vector embedding capabilities of MongoDB Atlas, combined with the super-fast and dependable Google Cloud ecosystem, to act as your intelligent co-pilot in the early stages of app creation."
    },
    {
      question: "Who is VibeFlow for?",
      answer: (
        <>
          VibeFlow is for:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Aspiring entrepreneurs with a new app idea.</li>
            <li>Developers looking to explore the feasibility of a new project.</li>
            <li>Students and hobbyists wanting to find resources for their coding projects.</li>
            <li>Anyone with an innovative concept who needs help understanding the technical landscape and planning their next steps.</li>
          </ul>
        </>
      )
    },
    {
      question: "How do I use VibeFlow?",
      answer: (
        <>
          Using VibeFlow is simple:
          <ol className="list-decimal list-inside mt-2 space-y-2">
            <li><strong>Sign Up / Log In:</strong> Create an account or log in to your existing one.</li>
            <li><strong>Describe Your Vibe:</strong> On the main application page, you'll see a large text area. Type in a natural language description of the application you want to build. Be as detailed or as broad as you like! For example: "I want to create a social media app for hikers to share photos of their favorite trails and rate them by difficulty."</li>
            <li><strong>Click "Flow":</strong> Hit the "Flow" button. VibeFlow's AI will analyze your description.</li>
            <li>
              <strong>Explore Insights:</strong> VibeFlow will present you with:
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li><strong>Suggested Datasets:</strong> Publicly available datasets that might be relevant to your app idea, along with sample data snippets and relevance scores.</li>
                <li><strong>API Recommendations:</strong> Suggested APIs that could power features in your app.</li>
                <li><strong>AI Feedback ("Vibe Check"):</strong> Constructive feedback on your idea's feasibility, potential challenges, and areas for refinement.</li>
                <li><strong>Learning Suggestions:</strong> Topics and areas to learn more about, relevant to your vibe.</li>
              </ul>
            </li>
            <li><strong>Refine & Iterate (Optional):</strong> You can modify your vibe description and click "Flow" again to see updated insights.</li>
            <li>
              <strong>Try in Playground (For "Playground App Idea" Datasets):</strong> If a suggested dataset is a "Playground App Idea," you can click "Try in Playground."
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li>VibeFlow will generate sample queries you can run against that app idea's structure.</li>
                <li>Click a sample query to see example results, helping you understand how data for such an app might be structured or queried.</li>
              </ul>
            </li>
          </ol>
        </>
      )
    },
    {
      question: "Does VibeFlow write the code for my app?",
      answer: "No, VibeFlow is not an automatic code generation tool that builds your entire application. Instead, it focuses on the crucial early stages of idea refinement, resource discovery, and planning. It provides you with insights, data suggestions, and learning pathways to empower *you* to build your app with a clearer vision and stronger foundation. It might offer small, illustrative code snippets for API usage in the future."
    },
    {
      question: "What kind of datasets and APIs can VibeFlow find?",
      answer: "VibeFlow searches through a curated collection of publicly available datasets and API information. This includes data from various domains like government, finance, social media trends, public utilities, and more. The goal is to help you find existing data and services that could be leveraged for your application."
    },
    {
      question: "Why am I not finding many resources for my specific app idea?",
      answer: "VibeFlow is currently a proof-of-concept, and our curated collection of datasets and APIs is actively growing. While we aim to provide relevant suggestions, our database is not yet exhaustive. If you don't find specific resources for a niche idea, it might be because it's outside our current curated set. We're continuously adding more resources to improve coverage. VibeFlow's main goal at this stage is to demonstrate the power of AI and vector search in discovering and refining app ideas based on available data."
    },
    {
      question: "Is VibeFlow free to use?",
      answer: "Yes, VibeFlow is currently free to use during this phase."
    },
    {
      question: "Who built VibeFlow?",
      answer: "VibeFlow was developed by Grace Esteban (Vibecoder Extraordinaire) and Duane Snider (The Quintessential Geek from San Francisco, California) as an entry for the MongoDB & Google Cloud AI in Action Challenge, with significant assistance from Google's Gemini AI."
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 text-gray-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-brand-primary mb-10">
          Frequently Asked Questions
        </h1>

        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">{faq.question}</h2>
              <div className="text-lg leading-relaxed text-gray-600">{faq.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
