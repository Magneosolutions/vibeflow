# Tech Context: VibeFlow

This document outlines the key technologies, tools, and platforms used in the VibeFlow project.

## 1. Frontend
*   **Language:** TypeScript
*   **Framework/Library:** React
*   **Build Tool:** Vite
*   **State Management:** (To be determined - e.g., Context API, Redux, Zustand) - Likely React Context API initially (`vibeflow-frontend/src/contexts/AuthContext.tsx` exists).
*   **Routing:** (To be determined - e.g., React Router) - Implied by multiple pages (`AboutPage.tsx`, `LoginPage.tsx`, etc.)
*   **Styling:**
    *   Standard CSS (`App.css`, `index.css`)
    *   Tailwind CSS (`tailwind.config.js`, `postcss.config.js`)
*   **Linting:** ESLint (`eslint.config.js`)
*   **Package Manager:** npm (inferred from `package.json`, `package-lock.json`)
*   **Containerization:** Docker (`vibeflow-frontend/Dockerfile`)
*   **Web Server (in Docker):** Nginx (inferred from `nginx.conf.template`, `entrypoint.sh`)

## 2. Backend
*   **Language:** TypeScript
*   **Framework:** Node.js with Express.js (inferred, common pattern)
*   **Package Manager:** npm (inferred from `package.json`, `package-lock.json`)
*   **Containerization:** Docker (`vibeflow-backend/Dockerfile`)
*   **API Style:** RESTful APIs

## 3. Database
*   **Primary Database:** MongoDB Atlas (for curated resources, potentially user vibes in the future)
    *   Interaction: Likely via Mongoose or native MongoDB Node.js driver.
*   **Vector Storage/Search:** Implied to be within MongoDB Atlas or a dedicated vector database if performance requires. The scripts (`populateGoogleTrendsEmbedding.ts`) suggest embedding generation.

## 4. Authentication
*   **Service:** Firebase Authentication (which uses Google Cloud Identity Platform - GCIP)
    *   Integration: `vibeflow-frontend/src/firebaseConfig.ts` confirms Firebase usage.

## 5. AI & Machine Learning
*   **Model Interaction:** The backend interacts with an external AI model service.
    *   Potential Providers: Google Vertex AI, OpenAI, or other similar platforms.
*   **Capabilities Used:**
    *   Natural Language Processing (NLP)
    *   Text Embedding Generation
    *   Insight Generation / AI Feedback
*   **Data Preparation:** Scripts exist for populating datasets and embeddings (e.g., `populateAppIdeasDataset.ts`, `populateGoogleTrendsEmbedding.ts`, `populateApiData.ts`, `populateLocalEventsDatasets.ts`), indicating a data pipeline for AI resources.

## 6. Deployment & Hosting
*   **Platform:** Google Cloud Run (for both frontend and backend services)
*   **Container Orchestration:** Implicitly managed by Cloud Run.
*   **CI/CD:** (To be determined - e.g., GitHub Actions, Google Cloud Build)

## 7. Version Control
*   **System:** Git
*   **Repository:** (Assumed to be on a platform like GitHub, GitLab, or Bitbucket)

## 8. Development Environment
*   **Local Development:** Likely using Docker Compose to run frontend and backend containers locally.
*   **IDE:** VSCode (inferred from user environment details).
*   **Shell:** Bash (Linux environment).

## 9. Key Libraries & Tools (Potential/Inferred - to be confirmed by inspecting `package.json` files)
*   **Frontend:**
    *   `axios` or `fetch` for API calls.
    *   `react-router-dom` for routing.
*   **Backend:**
    *   `express`
    *   `mongoose` or `mongodb` (MongoDB driver)
    *   `jsonwebtoken` (if handling tokens manually, though Firebase SDK might abstract this)
    *   Libraries for interacting with AI services (e.g., `@google-cloud/aiplatform`, `openai`)
    *   `dotenv` for environment variable management (`.env` file present).
    *   `cors` for Cross-Origin Resource Sharing.

## 10. Technical Constraints & Considerations
*   **Scalability:** Architecture choices (Cloud Run, MongoDB Atlas) aim for scalability.
*   **Security:** Authentication via Firebase; standard web security practices (HTTPS, input validation, etc.) must be implemented.
*   **Cost Management:** Pay-as-you-go nature of cloud services requires monitoring.
*   **API Rate Limits:** For external AI services and potentially other APIs.
*   **Cold Starts:** Possible with serverless functions on Cloud Run; may need optimization if problematic.
