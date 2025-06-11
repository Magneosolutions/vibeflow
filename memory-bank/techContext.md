# Tech Context: VibeFlow

## Core Technologies
The VibeFlow platform itself and the starter kits it generates will rely on a combination of modern technologies, prioritizing scalability, ease of integration, and developer experience.

1.  **Frontend (VibeFlow Platform):**
    *   **Framework: React**
        *   *Reasoning:* Chosen for its rich ecosystem, performance, component-based architecture, strong community support, and suitability for building dynamic and interactive UIs.
    *   **Language:** JavaScript/TypeScript. TypeScript is preferred for type safety and maintainability.
    *   **Styling:** CSS-in-JS (e.g., Styled Components, Emotion) or utility-first CSS (e.g., Tailwind CSS).

2.  **Backend (VibeFlow Platform):**
    *   **Framework:** To be decided (e.g., Node.js with Express.js/Fastify, Python with FastAPI/Django).
        *   *Considerations:* Performance, ease of integration with AI SDKs (like Google's), MongoDB drivers, and cloud provider APIs. Node.js/Express or Python/FastAPI are strong candidates.
    *   **Language:** JavaScript/TypeScript (if Node.js) or Python.
    *   **API Specification:** OpenAPI (Swagger) for clear API documentation and contract.
    *   **Authentication:** JWT (JSON Web Tokens) for securing APIs and managing user sessions. Consideration for OAuth 2.0 if third-party logins are desired in the future.

3.  **Database (VibeFlow Platform & Generated Apps):**
    *   **MongoDB Atlas:**
        *   Primary data store for curated public datasets, boilerplate project metadata.
        *   **Atlas Vector Search:** Core for semantic matching of user "vibes" to datasets/boilerplates.
        *   **Atlas Search:** For keyword-based filtering and faceted search.
        *   Used for provisioning new, free-tier clusters for user-generated applications.

4.  **AI & Machine Learning:**
    *   **Google Gemini API (or similar LLM):**
        *   Natural Language Processing (NLP): To understand user input, extract entities, and discern intent.
        *   Vector Embedding Generation: To convert user "vibes" and dataset descriptions into vectors for semantic search.
        *   Code Generation: To create starter codebases (frontend, backend, data schemas).
    *   *Considerations:* Model capabilities, API limits, cost, ease of integration.

5.  **Cloud Platform (VibeFlow Platform & Generated Apps):**
    *   **Google Cloud Platform (GCP):**
        *   **Google Cloud Run:** For deploying and hosting the VibeFlow backend and user-generated serverless web applications. Chosen for its simplicity, scalability, and pay-per-use model.
        *   **Google Cloud Build:** For automating the CI/CD pipeline (containerization and deployment) of user-generated applications.
        *   **Google Cloud APIs:** Integration with various Google APIs (e.g., Maps, Natural Language) as potential recommendations for user starter kits.
        *   **Google Cloud Identity Platform:** Chosen for managing user authentication.
            *   *Reasoning:* Provides robust, secure, and scalable identity management, handling sign-up/sign-in flows, multi-factor authentication, and integration with various identity providers if needed in the future. Reduces development burden for custom auth solution.

6.  **Version Control & CI/CD (Generated Apps):**
    *   **GitHub:**
        *   Generated starter kits will be pushed to new GitHub repositories under the user's control (or a VibeFlow organization initially).
        *   GitHub API will be used for programmatic repository creation.
    *   **Google Cloud Build:** Triggered by commits to the GitHub repository (for user apps) to build and deploy.

## Development Setup & Environment
*   **Local Development:**
    *   Node.js/npm or Python/pip for backend development.
    *   Docker and Docker Compose for containerizing services locally, mimicking the cloud environment.
    *   MongoDB Community Server or a local Docker instance of MongoDB for development against the database.
    *   Access to cloud service emulators if available (e.g., for Cloud Run, Cloud Build).
*   **IDE:** VS Code is recommended with relevant extensions for JavaScript/TypeScript/Python, Docker, etc.
*   **Configuration Management:** `.env` files for managing API keys, connection strings, and other sensitive information. These should be gitignored.

## Technical Constraints & Considerations
*   **API Rate Limits:** Interactions with external APIs (AI models, GitHub, GCP, MongoDB Atlas) will be subject to rate limits. Implement appropriate error handling, retries, and potentially queuing mechanisms.
*   **Cost Management:**
    *   Leverage free tiers of MongoDB Atlas and GCP for user-generated apps as much as possible.
    *   Monitor API usage for AI services and cloud services to manage costs for the VibeFlow platform itself.
*   **Security:**
    *   Securely manage API keys and credentials.
    *   Validate all user inputs.
    *   Implement secure password storage (hashing and salting if not using a managed identity service).
    *   Protect against common web vulnerabilities (XSS, CSRF, SQLi - though NoSQL is used, injection is still a concern).
    *   Ensure generated code follows basic security best practices.
    *   Protect user data and PII.
*   **Scalability:** Design backend services to be scalable, potentially using serverless functions or container orchestration. MongoDB Atlas and Cloud Run are inherently scalable. Authentication service must also be scalable.
*   **Code Generation Quality:** The utility of VibeFlow heavily depends on the quality, correctness, and relevance of the AI-generated code. This will require careful prompt engineering and potentially fine-tuning models or using specialized code generation AIs.
*   **Dataset Curation:** The quality and breadth of the curated public datasets in MongoDB will significantly impact the value proposition. This requires an ongoing effort.
*   **Boilerplate Variety:** Offering a diverse set of well-structured boilerplates for different application types and tech stacks will be important.

## Dependencies (High-Level)
*   **VibeFlow Platform:**
    *   MongoDB Node.js/Python Driver
    *   Google Cloud SDK/Client Libraries (for Cloud Build, Cloud Run, AI APIs)
    *   GitHub API Client Library
    *   Chosen frontend and backend frameworks
*   **Generated Starter Kits:**
    *   Dependencies specific to the chosen tech stack (e.g., React, Express, etc.)
    *   MongoDB Driver
    *   `gcloud` CLI (for deployment scripts, though Cloud Build handles this)
