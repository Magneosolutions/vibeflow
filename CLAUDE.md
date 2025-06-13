# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend Development
```bash
cd vibeflow-frontend

# Development
npm run dev          # Start Vite dev server (http://localhost:5173)

# Build & Deploy
npm run build        # TypeScript check + Vite production build
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint on all files
```

### Docker & Deployment
```bash
# Build and run Docker container locally
cd vibeflow-frontend
docker build -t vibeflow-frontend .
docker run -p 8080:8080 vibeflow-frontend

# Cloud Build deployment (from repo root)
gcloud builds submit --config cloudbuild.yaml
```

## Architecture Overview

VibeFlow transforms natural language app descriptions into deployable starter kits. The system uses MongoDB Atlas Vector Search as its core technology for semantic matching between user descriptions and curated datasets.

### Current Implementation
- **Frontend**: React SPA with TypeScript, Vite, Tailwind CSS
- **Deployment**: Google Cloud Run with Nginx serving static files
- **Authentication**: Firebase configured but not yet integrated (currently simulated)

### Planned Architecture
1. **Vibe Analysis Service**: Processes user descriptions using Gemini API
2. **Data Matching Service**: MongoDB Atlas Vector Search for semantic matching
3. **Starter Kit Generation**: Creates customized starter kits based on matches
4. **Provisioning Service**: GitHub API integration for repo creation
5. **Deployment Service**: One-click deployment to cloud platforms

### Key Technical Patterns
- Dynamic port configuration for Cloud Run using `envsubst` in entrypoint.sh
- Multi-stage Docker builds (Node for build, Nginx for serve)
- Stateless design leveraging Cloud Run's serverless benefits
- Vector embeddings stored in MongoDB for semantic search

### Known Issues & Considerations
1. **CSS Deployment Issue**: Frontend styling updates may not reflect in Cloud Run deployment despite successful builds. Current workaround involves Docker cache busting with CACHEBUST build arg.
2. **Organization Policies**: May need admin override for public Cloud Run access
3. **Authentication**: Real Google Cloud Identity Platform integration pending (currently using simulated auth)

### MongoDB Integration Plan
- Collections: `datasets` (with vector embeddings), `vibes`, `templates`
- Indexes: Vector search index on `embedding` field
- Connection: Via MongoDB Atlas connection string (to be configured)