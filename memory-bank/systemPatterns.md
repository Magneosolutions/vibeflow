# System Patterns: VibeFlow

## Core Architecture
VibeFlow will be a web application with the following major components:

1.  **Frontend (Client-Side):**
    *   Built with a modern JavaScript framework (e.g., React, Vue, or Svelte - to be decided, prioritizing speed and ease of use).
    *   Handles user input (the "vibe" description).
    *   Displays suggestions (datasets, architectures, APIs).
    *   Manages user selections for the starter kit.
    *   Initiates the "Build My Starter Kit" and "Deploy to Google Cloud" actions.
    *   Handles user authentication (sign-up, login, sign-out) interactions.

2.  **Backend (Server-Side):**
    *   Built with a scalable framework (e.g., Node.js/Express, Python/FastAPI - to be decided, prioritizing integration with AI and cloud services).
    *   **Authentication Service:**
        *   Manages user registration, login (e.g., issuing JWTs), and logout.
        *   Integrates with an identity provider or manages user credentials securely.
    *   **Vibe Analysis Service:**
        *   Receives the user's text input (requires authenticated session).
        *   Communicates with an external AI service (e.g., Google Gemini API) to:
            *   Extract key concepts, features, and potential data models.
            *   Generate a vector embedding of the "vibe."
    *   **Data Matching Service:**
        *   Queries MongoDB Atlas:
            *   Uses Vector Search with the generated embedding to find semantically similar public datasets and project boilerplates.
            *   Uses Atlas Search (keyword-based) for complementary dataset discovery.
    *   **Starter Kit Generation Service:**
        *   Communicates with an external AI service (e.g., Google Gemini API or a specialized code generation model) to generate a basic codebase (frontend components, backend API endpoints, data schema) based on the user's vibe, selected dataset, and chosen architecture.
        *   Creates a new GitHub repository for the user via the GitHub API.
        *   Pushes the generated code to the new repository.
    *   **Provisioning Service:**
        *   Communicates with MongoDB Atlas API to:
            *   Create a new free-tier cluster.
            *   Create necessary collections.
            *   Optionally, load the selected public dataset.
        *   Generates a `.env` file with the MongoDB connection string and any selected Google API keys, and includes it in the generated GitHub repository.
    *   **Deployment Service:**
        *   Communicates with Google Cloud Build API to trigger a pre-configured build pipeline.
        *   The pipeline containers the application from the user's GitHub repo and deploys it to Google Cloud Run.
        *   Returns the public URL of the deployed application to the frontend.

3.  **Database (MongoDB Atlas):**
    *   **Curated Datasets Collection:** Stores metadata and potentially the actual data of public datasets. Each entry will include:
        *   Name, description, source, category, keywords.
        *   Vector embedding of its description/content for semantic search.
    *   **Boilerplate Projects Collection:** Stores metadata about open-source project boilerplates. Each entry will include:
        *   Name, description, tech stack, features, link to GitHub repo.
        *   Vector embedding for semantic search.
    *   User-generated clusters are provisioned separately for each user's starter kit.

4.  **External Services:**
    *   **AI Model (e.g., Google Gemini):** For natural language understanding, feature extraction, vector embedding generation, and code generation.
    *   **GitHub API:** For creating repositories and pushing code.
    *   **Google Cloud Platform:**
        *   **Cloud Build:** For CI/CD and deploying user applications.
        *   **Cloud Run:** For hosting user applications as serverless web apps.
        *   **Identity Platform (or similar):** For managing user identities and authentication flows, if a managed service is chosen.
        *   (Potentially other Google APIs as recommended to users, e.g., Maps, Natural Language).

## Key Technical Decisions & Patterns
*   **Microservices-oriented Backend (Potentially):** While starting monolithic for MVP, the backend services (Vibe Analysis, Data Matching, Generation, Provisioning, Deployment) are designed to be potentially separable into microservices for scalability.
*   **API-Driven:** All interactions between frontend, backend, and external services will be through well-defined APIs.
*   **Vector Search as a Core Technology:** MongoDB Atlas Vector Search is central to matching user intent with relevant resources. This is a primary differentiator.
*   **AI-Assisted Code Generation:** Leveraging LLMs to generate starter code significantly speeds up the process. The quality and relevance of this generated code will be a key focus.
*   **Infrastructure as Code (for user apps):** The `cloudbuild.yaml` (or similar) in the generated starter kit will define the deployment, making it transparent and customizable.
*   **Stateless Application Design (for user apps):** Generated starter apps should ideally be stateless to leverage serverless benefits on Cloud Run. State will be managed in MongoDB.
*   **Emphasis on Free Tiers:** To make VibeFlow accessible, it will leverage free tiers of MongoDB Atlas and Google Cloud for the generated starter kits where possible.

## Component Relationships (High-Level)
```mermaid
graph TD
    UserInterface["Frontend (User Interface)"] -- "Auth Credentials (Signup/Login)" --> BackendAPI["Backend API Gateway"]
    BackendAPI -- "Auth Request" --> AuthService["Authentication Service"]
    AuthService -- "Validate/Create User, Issue Token" --> BackendAPI
    BackendAPI -- "Auth Token/Session" --> UserInterface

    UserInterface -- "User Input (Vibe) (Authenticated)" --> BackendAPI

    BackendAPI -- "Analyze Request (Authenticated)" --> VibeAnalysisService["Vibe Analysis Service"]
    VibeAnalysisService -- "Text" --> AI_NLP["AI Model (NLP, Embedding)"]
    AI_NLP -- "Concepts, Vector" --> VibeAnalysisService
    VibeAnalysisService -- "Vector, Keywords" --> DataMatchingService["Data Matching Service"]

    DataMatchingService -- "Vector/Keyword Query" --> MongoDB["MongoDB Atlas (Curated Datasets & Boilerplates)"]
    MongoDB -- "Matching Results" --> DataMatchingService
    DataMatchingService -- "Suggestions" --> BackendAPI
    BackendAPI -- "Display Suggestions" --> UserInterface

    UserInterface -- "User Selections (Dataset, Architecture)" --> BackendAPI
    BackendAPI -- "Generate Kit Request" --> StarterKitService["Starter Kit Generation Service"]
    StarterKitService -- "Generation Prompts" --> AI_CodeGen["AI Model (Code Generation)"]
    AI_CodeGen -- "Generated Code" --> StarterKitService
    StarterKitService -- "Create Repo, Push Code" --> GitHubAPI["GitHub API"]
    GitHubAPI -- "Repo Link" --> StarterKitService

    StarterKitService -- "Provision DB Request" --> ProvisioningService["Provisioning Service"]
    ProvisioningService -- "Create Cluster/Collections" --> MongoDB_AtlasAPI["MongoDB Atlas API"]
    MongoDB_AtlasAPI -- "Connection String" --> ProvisioningService
    ProvisioningService -- "DB Details, API Keys" --> StarterKitService
    StarterKitService -- ".env file" --> GitHubAPI %% Add to repo

    StarterKitService -- "Kit Ready (Repo Link)" --> BackendAPI
    BackendAPI -- "GitHub Repo Link" --> UserInterface

    UserInterface -- "Deploy Request" --> BackendAPI
    BackendAPI -- "Deploy App Request" --> DeploymentService["Deployment Service"]
    DeploymentService -- "Trigger Pipeline (Repo Link)" --> GoogleCloudBuildAPI["Google Cloud Build API"]
    GoogleCloudBuildAPI -- "Build & Deploy" --> GoogleCloudRun["Google Cloud Run (User's App)"]
    GoogleCloudRun -- "Public URL" --> DeploymentService
    DeploymentService -- "Deployed App URL" --> BackendAPI
    BackendAPI -- "Public URL" --> UserInterface
```

This diagram illustrates the primary flow and interactions between the system components. The focus is on modular services that handle specific responsibilities, orchestrated by the backend API.
