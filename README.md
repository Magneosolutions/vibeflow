# VibeFlow: Your AI-Powered Idea Co-Pilot

**MongoDB Google AI Challenge 2025 Entry**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-VibeFlow-blue?style=for-the-badge)](https://vibeflow-679820915121.us-west2.run.app)
[![Backend API](https://img.shields.io/badge/API-Backend-green?style=for-the-badge)](https://vibeflow-backend-679820915121.us-west2.run.app)

> Transform your app ideas from vague concepts into actionable plans with AI-powered resource discovery and interactive data exploration.

## Challenge Alignment: MongoDB Track

VibeFlow directly addresses the **MongoDB Challenge** by:

- **Public Dataset Exploration**: Curates and analyzes diverse public datasets (Google Trends, App Ideas, APIs) to help users discover relevant data for their projects
- **AI-Powered Analysis**: Uses Google Gemini AI to generate embeddings and provide intelligent feedback on user ideas
- **MongoDB Vector Search**: Leverages MongoDB Atlas Vector Search to semantically match user "vibes" with relevant datasets and APIs
- **Google Cloud Integration**: Seamlessly integrates MongoDB with Google Cloud services (Cloud Run, Identity Platform, Gemini AI)
- **New Perspectives**: Helps users understand and interact with data through an innovative "playground" feature and AI-generated insights

## What Makes VibeFlow Unique

Unlike traditional code generators, VibeFlow is an **interactive co-pilot** that:

1. **Captures Your Vision**: Describe your app idea in natural language
2. **Discovers Resources**: AI-powered vector search finds relevant datasets and APIs
3. **Provides Insights**: Get a "Vibe Check" with feasibility analysis and suggestions
4. **Interactive Exploration**: Try sample queries on real datasets in our playground
5. **Curated Learning**: Access tailored tutorials and documentation

## Technical Architecture

### Core Technologies
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB Atlas with Vector Search
- **AI**: Google Gemini API (embedding-001 model)
- **Authentication**: Google Cloud Identity Platform
- **Deployment**: Google Cloud Run + Cloud Build CI/CD

### MongoDB Implementation Highlights

#### Vector Search Excellence
```javascript
// Semantic search using MongoDB Atlas Vector Search
const searchResults = await datasetsCollection.aggregate([
  {
    $vectorSearch: {
      index: 'vector_index_datasets_description',
      path: 'description_embedding',
      queryVector: vibeEmbedding,    // 768-dimension Gemini embeddings
      numCandidates: 100,
      limit: 5,
    },
  },
  {
    $project: {
      name: 1,
      description: 1,
      score: { $meta: 'vectorSearchScore' }
    }
  }
]);
```

#### Multi-Collection Architecture
- **`datasets`**: Curated public datasets with vector embeddings
- **`apis`**: API recommendations with semantic search
- **Vector Indexes**: Optimized for 768-dimension Gemini embeddings with cosine similarity

### Google Cloud Integration
- **Cloud Run**: Containerized deployment with auto-scaling
- **Cloud Build**: Automated CI/CD from GitHub
- **Identity Platform**: Secure authentication
- **Gemini AI**: Text embeddings and intelligent feedback

## Key Features

### 1. Intelligent Vibe Processing
- Natural language input processing
- AI-generated embeddings using Google Gemini
- Semantic matching with MongoDB Vector Search

### 2. Resource Discovery Engine
- **Dataset Recommendations**: Find relevant public datasets
- **API Suggestions**: Discover useful APIs for your project
- **Relevance Scoring**: Vector similarity scores for match quality

### 3. Interactive Data Playground
- AI-generated sample queries for datasets
- Real-time query execution
- Explore data structure and potential use cases

### 4. AI-Powered Insights
- "Vibe Check" feedback on idea feasibility
- Suggestions for improvement and next steps
- Learning resource recommendations

## Demo Scenarios

Try these example "vibes" to see VibeFlow in action:

```
"I want to build an app that shows trending topics on a map"
"Help me create a social app for sharing local events"
"I need data for a dashboard showing what's popular right now"
"Building a recommendation engine for discovering new interests"
```

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Cloud account with Gemini API access

### Setup
```bash
# Clone the repository
git clone https://github.com/Magneosolutions/vibeflow.git
cd vibeflow

# Backend setup
cd vibeflow-backend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev

# Frontend setup (new terminal)
cd ../vibeflow-frontend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

### Environment Variables
```bash
# Backend (.env)
MONGODB_URI_VIBEFLOW=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
PORT=3001

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:3001/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
# ... other Firebase config
```

## Data & AI Pipeline

1. **Data Curation**: Manually curated public datasets with rich metadata
2. **Embedding Generation**: Google Gemini creates 768-dimension vectors
3. **Vector Storage**: MongoDB Atlas stores embeddings with original data
4. **Semantic Search**: Real-time vector similarity matching
5. **AI Analysis**: Contextual feedback and query generation

## Impact on Developer Community

VibeFlow addresses a critical gap in the developer journey:

- **Faster Ideation**: Reduce time from concept to plan
- **Learning Acceleration**: Discover relevant resources quickly
- **Data Discovery**: Uncover datasets you didn't know existed
- **Inspiration**: Get new perspectives on your ideas
- **Practical Guidance**: Move from "what if" to "how to"

## MongoDB Challenge Criteria

### Technological Implementation
- **High-quality MongoDB integration** with Vector Search and multiple collections
- **Sophisticated Google Cloud usage** across multiple services
- **Clean, maintainable TypeScript codebase** with proper error handling

### Design Excellence
- **Intuitive user experience** with clear information hierarchy
- **Responsive design** that works across devices
- **Interactive elements** that engage users meaningfully

### Potential Impact
- **Empowers solo developers** and small teams
- **Lowers barriers** to app development
- **Educational value** through curated learning resources
- **Scalable architecture** for growing dataset collections

### Creative Innovation
- **Novel "vibe-to-plan" workflow** unlike traditional development tools
- **Interactive data playground** for hands-on exploration
- **AI as augmentation** rather than replacement
- **Semantic resource discovery** using cutting-edge vector search

## Future Roadmap

- **Expanded Dataset Library**: More diverse public datasets
- **Enhanced AI Feedback**: Multi-model analysis and suggestions
- **Community Features**: User-contributed datasets and vibes
- **Analytics Dashboard**: Track idea evolution and success metrics
- **API Marketplace**: Integrated API testing and documentation

## What We Learned

Throughout the development of VibeFlow, we've learned a tremendous amount:

- **The Power of Iteration**: The initial concept evolved through discussion and focusing on core user value, refining it into the "Interactive Vibe Refinement & Learning Tool" it is today.
- **Vector Search is Key**: Implementing MongoDB Atlas Vector Search was a game-changer for matching user ideas to relevant datasets. Understanding how to generate effective embeddings and structure queries for semantic similarity was significant.
- **AI for Augmentation, Not Just Generation**: AI is incredibly powerful for analyzing text, generating embeddings, and providing contextual feedback. The focus shifted from AI generating entire projects to AI augmenting the user's planning process.
- **Cloud Deployment Nuances**: Deploying a full-stack application to Google Cloud Run involved learning about Docker, Nginx configuration for dynamic ports, and navigating GCP's IAM policies.
- **Importance of Clear Documentation**: Maintaining comprehensive documentation has been vital for consistent development and project continuity.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **MongoDB Atlas** for powerful vector search capabilities
- **Google Cloud** for AI services and reliable infrastructure
- **The Developer Community** for inspiration and feedback

---

**Built for the MongoDB Google AI Challenge 2025**

*VibeFlow: Where ideas meet implementation*
