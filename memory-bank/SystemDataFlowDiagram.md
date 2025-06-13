# VibeFlow System Data Flow Diagram (Interactive Refinement Focus)

This diagram illustrates the primary data and control flow within the VibeFlow application, focusing on its role as an interactive refinement and learning tool. It is based on the component relationships outlined in `systemPatterns.md`.

```mermaid
graph TD
    UserInterface["Frontend (User Interface)"] -- "Auth Credentials (Signup/Login)" --> BackendAPI["Backend API Gateway"]
    BackendAPI -- "Auth Request" --> AuthService["Authentication Service (GCIP)"]
    AuthService -- "Validate/Create User, Issue Token" --> BackendAPI
    BackendAPI -- "Auth Token/Session" --> UserInterface

    UserInterface -- "User Input (Vibe / Refined Vibe) (Authenticated)" --> BackendAPI

    BackendAPI -- "Analyze & Feedback Request (Authenticated)" --> VibeAnalysisFeedbackService["Vibe Analysis & Feedback Service"]
    VibeAnalysisFeedbackService -- "Text for Analysis" --> AI_Model["AI Model (NLP, Embedding, Insight Generation)"]
    AI_Model -- "Concepts, Vector, AI Feedback" --> VibeAnalysisFeedbackService
    VibeAnalysisFeedbackService -- "Vector, Keywords, AI Feedback" --> BackendAPI

    BackendAPI -- "Discover Resources Request (Vector, Keywords)" --> ResourceDiscoveryService["Resource Discovery Service"]
    ResourceDiscoveryService -- "Vector/Keyword Query" --> MongoDB_Resources["MongoDB Atlas (Curated Datasets, APIs, Learning Links)"]
    MongoDB_Resources -- "Matching Resource Metadata" --> ResourceDiscoveryService
    ResourceDiscoveryService -- "Suggested Resources" --> BackendAPI
    
    BackendAPI -- "Display Suggestions (Datasets, APIs, Learning Links, AI Feedback)" --> UserInterface
    
    %% User can refine vibe and loop back
    UserInterface -- "Refine Vibe / Ask 'What If?'" --> BackendAPI 
```

This diagram illustrates the revised flow focusing on iterative refinement and resource discovery. The VibeFlow platform itself is hosted on Google Cloud Run.
