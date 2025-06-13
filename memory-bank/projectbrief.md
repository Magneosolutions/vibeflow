# Project Brief: VibeFlow

## Core Concept
VibeFlow is an **Interactive Vibe Refinement & Learning Tool** designed to help "vibecoders" (individuals with application ideas) transform their initial concepts into clear, actionable plans. Users describe their app idea in natural language. VibeFlow then uses AI to analyze the description and MongoDB Atlas Search (Vector and Keyword) to discover relevant public datasets, APIs, and potentially open-source components. Instead of generating a full starter kit, VibeFlow acts as an intelligent co-pilot, offering:
*   **Resource Discovery:** Uncovering relevant public datasets and APIs.
*   **Interactive Refinement:** Allowing users to explore "what if" scenarios.
*   **Curated Learning:** Providing links to tutorials and documentation tailored to their idea.
*   **AI Feedback:** Offering a "Vibe Check" on feasibility and potential challenges.
The goal is to empower users to understand, refine, and plan their application with the help of AI-driven insights and curated resources.

## User Journey
1.  **Describe Idea:** The user is greeted with a simple, clean interface: "Describe the application you want to build." They type their idea in natural language.
    *   Example: "I want to create a social media app for hikers to share photos of their favorite trails and rate them by difficulty."
2.  **AI-Powered Analysis & Data Matching:** The user hits "Flow."
    *   **Vibe Analysis (AI):** The app sends this text to an AI model (like Google's Gemini) to extract key concepts, features, potential data models, and generate a vector embedding.
    *   **MongoDB Atlas Search (Vector & Keyword):**
        *   Uses the vector embedding to find semantically similar public datasets, APIs, and potentially relevant open-source components/patterns from curated MongoDB collections.
        *   Uses keywords identified by AI to perform targeted searches in MongoDB.
3.  **The "Vibe Explorer" - Your Interactive Launchpad:** VibeFlow presents an interactive dashboard.
    *   **Resource Hub:**
        *   **Suggested Datasets:** Lists relevant public datasets with previews and schema insights.
        *   **API Recommendations:** Suggests APIs with descriptions and potential use cases.
        *   **(Future) Component/Pattern Pointers:** Links to relevant open-source UI components or architectural patterns.
    *   **Interactive Tools:**
        *   **Dataset Playground (Future):** Allow users to (safely) run AI-generated sample queries against suggested datasets.
        *   **"What if I add...?" Scenarios:** Users can modify their vibe or add features. VibeFlow re-analyzes and updates suggestions.
        *   **"Vibe Check":** AI provides feedback on feasibility, complexity, and potential challenges of the current vibe.
    *   **Curated Learning:**
        *   Links to specific tutorials, documentation (e.g., MongoDB Atlas Search docs, API docs, framework guides) relevant to the user's vibe and suggested resources.
4.  **Refinement & Planning:** The user interacts with the "Vibe Explorer" to:
    *   Understand the data landscape for their idea.
    *   Identify key APIs and technologies.
    *   Refine their feature set based on AI feedback and resource availability.
    *   Gather learning materials to proceed with development independently.
    *   VibeFlow does **not** automatically generate a full codebase, provision infrastructure, or handle deployment in this model. It empowers the user with knowledge and resources to do so themselves.

## Addressing the MongoDB Challenge
*   **Curated Resource Collections (MongoDB):** The core of VibeFlow is a set of curated databases in MongoDB Atlas:
    *   Public datasets (metadata, sample data, vector embeddings).
    *   APIs (descriptions, endpoints, use cases, vector embeddings).
    *   (Future) Open-source components, architectural patterns, and learning resources (metadata, links, vector embeddings).
*   **AI for Analysis and Insight:**
    *   Analysis: Use AI to understand user intent, extract key elements, and create vector embeddings.
    *   Insight & Feedback: Use AI to provide feasibility checks, suggest data usage, and generate "what if" scenario impacts. AI is not primarily for full codebase generation but for snippets, explanations, and guidance.
*   **MongoDB Search & Vector Search:**
    *   Vector Search is key for matching the user's "vibe" to relevant datasets, APIs, and other resources.
    *   Atlas Search provides powerful, fast filtering and keyword search to complement the vector search.
*   **Google Integrations:**
    *   Hosting & Deployment: The entire application and the user's generated apps are hosted on Google Cloud (specifically Cloud Run).
    *   Build & CI/CD: Google Cloud Build automates the deployment process.
    *   APIs: Seamlessly integrate Google APIs (Maps, Natural Language, etc.) into the suggested starter kits.

## From Vibe Coder to Informed Planner
VibeFlow aims to empower "vibecoders" by:
*   **Clarifying Ideas:** Helping them refine their initial concept into a more concrete plan.
*   **Accelerating Research:** Quickly surfacing relevant datasets, APIs, and learning materials.
*   **Building Understanding:** Providing insights into how different technologies and data sources can be used.
*   **Reducing Initial Overwhelm:** Offering a structured way to explore the technical landscape of their idea.
*   **Fostering Independent Development:** Equipping them with the knowledge and resources to start building, rather than providing a black-box solution.

## Next Steps & Development Plan (Revised Focus: Interactive Refinement & Learning)

### Phase 1 (MVP - Interactive Resource Discovery & Basic Feedback):
*   **Curate Initial Resources:**
    *   Manually curate a small list (20-30) of high-quality public datasets (metadata, sample data snippets) and store them in MongoDB Atlas with vector embeddings.
    *   Manually curate a small list (10-15) of common APIs (descriptions, use cases) and store them in MongoDB Atlas with vector embeddings.
*   **Core "Vibe" Interaction:**
    *   Build the frontend "Vibe" input on `MainAppPage.tsx` (UI text already updated).
    *   Integrate AI (e.g., Gemini) for text analysis (key concept extraction, vector embedding generation).
*   **Resource Matching & Display:**
    *   Implement MongoDB Atlas Vector Search to match a vibe to datasets and APIs.
    *   Display suggested datasets and APIs on the frontend with basic information.
*   **Basic AI "Vibe Check":**
    *   Implement a simple AI-driven feedback mechanism offering initial thoughts on the vibe's general scope or common considerations.
*   **Curated Learning Links (Static Initial Set):**
    *   Provide a small, static set of general learning links (e.g., to MongoDB docs, React docs, API design guides). Dynamic, tailored links will come later.
*   **Focus:** Make the "Vibe Input -> AI Analysis -> MongoDB Search -> Display Suggested Datasets/APIs + Basic AI Feedback" loop functional and useful.

### Phase 2 (Enhanced Interaction & Deeper Learning):
*   **"What if I add...?" Scenarios:** Allow users to iteratively modify their vibe and see updated resource suggestions and AI feedback.
*   **Dynamic Curated Learning:** AI suggests specific tutorials/documentation based on the analyzed vibe and matched resources.
*   **Dataset Previews:** Show more detailed previews or sample data from matched datasets.
*   **API Snippets:** Provide basic, illustrative code snippets for interacting with suggested APIs.
*   **Expand Curated Collections:** Grow the MongoDB collections of datasets, APIs, and introduce curated open-source components/patterns.

### Phase 3 (Advanced Co-Pilot Features & Community):
*   **Dataset Playground (Controlled):** Allow users to run AI-generated sample queries against (a sandboxed version of or copies of) suggested datasets.
*   **More Sophisticated "Vibe Check":** Deeper AI analysis of feasibility, potential architectural challenges, and alternative approaches.
*   **(Future) User Contributions:** Allow users to suggest datasets, APIs, or learning resources (with moderation).
*   **(Future) Personalized "Vibe" History:** Allow users to save and revisit their explored vibes and discovered resources.
