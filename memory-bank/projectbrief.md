# Project Brief: VibeFlow

## Core Concept
VibeFlow is an application that allows users to describe an application they want to build in natural language. It then uses AI to analyze the description, matches it with relevant public datasets and open-source project boilerplates using vector and keyword search in MongoDB, and generates a starter kit. This starter kit includes a basic codebase, a provisioned MongoDB Atlas cluster, and configuration for one-click deployment to Google Cloud.

## User Journey
1.  **Describe Idea:** The user is greeted with a simple, clean interface dominated by a single text box: "Describe the application you want to build." The user types in their idea in natural language.
    *   Example: "I want to create a social media app for hikers to share photos of their favorite trails and rate them by difficulty."
2.  **AI-Powered Analysis & Data Matching:** The user hits "Flow."
    *   **Vibe Analysis (AI):** The app sends this text to an AI model (like Google's Gemini) to extract key concepts, features, and potential data models.
    *   **Vector Search (MongoDB):** The AI generates a vector embedding of the user's "vibe." VibeFlow then uses MongoDB Atlas Vector Search to query a curated database of public datasets and open-source project boilerplates. It looks for datasets and code that are semantically similar to the user's idea.
    *   **Keyword Search (MongoDB):** Simultaneously, MongoDB Atlas Search can be used to find datasets based on specific keywords identified by the AI (e.g., "trails," "photos," "maps," "user ratings").
3.  **The "Launchpad" - Your Curated Starting Point:** VibeFlow presents a dashboard with tailored suggestions.
    *   **Suggested Datasets:** "We found these public datasets that could power your app." (e.g., a dataset of National Park trails, a collection of geographic location APIs). The user can preview and select one.
    *   **Suggested Architecture:** "Based on your vibe, we recommend a 'Social Media App' starter kit." The user can choose a tech stack (e.g., React/Node.js or Vue/Python).
    *   **API Recommendations:** "Your app might need these APIs." (e.g., Google Maps API for trail visualization, a weather API).
4.  **Generation & Provisioning:** The user finalizes their choices and clicks "Build My Starter Kit."
    *   **AI Code Generation:** VibeFlow uses an AI model to generate a basic, working codebase. It creates simple frontend components, backend API endpoints, and a data schema based on the user's vibe and selected dataset.
    *   **MongoDB Atlas Provisioning:** It automatically creates a new, free-tier MongoDB Atlas cluster, creates the necessary collections, and (optionally) loads the selected public dataset into it.
    *   **Google Cloud Integration:** It populates a configuration file (.env) with the new MongoDB connection string and any selected Google API keys.
5.  **One-Click Deployment:** The final step.
    *   The user gets a link to a newly created GitHub repository containing their personalized starter kit.
    *   A prominent button on the VibeFlow dashboard says "Deploy to Google Cloud."
    *   Clicking this button triggers a pre-configured Google Cloud Build pipeline. It containers the application and deploys it as a serverless web app on Google Cloud Run.
    *   Within minutes, the user gets a public URL to their live, working application.

## Addressing the MongoDB Challenge
*   **Public Dataset:** The core of VibeFlow is a curated database of public datasets stored in MongoDB. The first task would be to collect and categorize these. A great source would be the `awesome-public-datasets` list on GitHub.
*   **AI for Analysis and Generation:**
    *   Analysis: Use AI to understand the user's intent and create vector embeddings.
    *   Generation: Use AI to generate the starter codebase.
*   **MongoDB Search & Vector Search:**
    *   Vector Search is key, matching the user's "vibe" to relevant datasets and project templates.
    *   Atlas Search provides powerful, fast filtering and keyword search to complement the vector search.
*   **Google Integrations:**
    *   Hosting & Deployment: The entire application and the user's generated apps are hosted on Google Cloud (specifically Cloud Run).
    *   Build & CI/CD: Google Cloud Build automates the deployment process.
    *   APIs: Seamlessly integrate Google APIs (Maps, Natural Language, etc.) into the suggested starter kits.

## From Vibe Coder to Full-Stack Developer
VibeFlow aims to empower users by providing:
*   A Complete, Readable Codebase: Users can clone the repo and understand the frontend, backend, and database connections.
*   A Working Deployment Pipeline: Users can examine the `cloudbuild.yaml` file to understand containerization and deployment.
*   A Live, Scalable App: Users get a real URL and a project running on robust infrastructure, motivating learning and iteration.

## Next Steps & Development Plan

### Phase 1 (MVP):
*   Manually curate a small list (20-30) of high-quality public datasets and store them in MongoDB Atlas.
*   Build the core "Vibe" input and use AI to generate vector embeddings.
*   Implement Vector Search to match a vibe to a dataset.
*   Instead of generating code, just provide a link to a single, hard-coded boilerplate project on GitHub.
*   Focus on making the MongoDB Search -> Suggested Dataset flow work perfectly.

### Phase 2 (Core Functionality):
*   Integrate AI code generation to create tailored starter kits.
*   Automate the MongoDB Atlas provisioning.
*   Build the one-click "Deploy to Google Cloud" feature using the Cloud Build API.

### Phase 3 (Growth):
*   Allow users to submit and share their own boilerplates.
*   Expand the curated dataset library.
*   Add more complex architectural patterns (e.g., microservices, event-driven).
