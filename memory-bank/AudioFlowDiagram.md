# VibeFlow System Data Flow Diagram

This diagram illustrates the primary data and control flow within the VibeFlow application, from user input to the deployment of a generated starter kit. It is based on the component relationships outlined in `systemPatterns.md`.

```mermaid
graph TD
    UserInterface["Frontend (User Interface)"] -- "User Input (Vibe)" --> BackendAPI["Backend API Gateway"]

    BackendAPI -- "Analyze Request" --> VibeAnalysisService["Vibe Analysis Service"]
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

**Note:** While named `AudioFlowDiagram.md` as per user instruction, this diagram represents the overall system data flow. If a specific "audio" related data flow is intended, further clarification will be needed to create a more specialized diagram.
