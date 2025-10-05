# IWF Jira Util

A Cloudflare Worker API that provides AI-powered story point estimation for Jira issues using intelligent similarity matching and historical data analysis.

## Features

### Story Points Estimation
The API analyzes Jira issues and provides story point estimates using AI, with support for multiple output formats and intelligent example selection.

**Endpoint:** `GET /story-points`

**Parameters:**
- `tenant` (required): Tenant identifier
- `issue` (required): Jira issue key (e.g., "PROJ-123")
- `format` (optional): Response format - `json` (default), `text`, or `md`
- `apikey` (required): API key for authentication (query param or `x-api-key` header)

**Response Formats:**
- `json`: Standard JSON response with `storyPoints` and `reasoning` fields
- `text`: Plain text format with story points and reasoning
- `md`: Markdown format with headers and structured content

## How It Works

### 1. Historical Data Management
- **Auto-cleanup**: Maintains maximum 100 records per tenant, automatically removing oldest entries
- **Issue caching**: Returns existing estimates for previously scored issues without re-processing
- **Optimized storage**: Keeps only relevant historical data for performance

### 2. Intelligent Example Selection
The system uses a sophisticated algorithm to select the best examples for AI context:

**Similarity Matching:**
- Calculates text similarity between current issue title and historical issues
- Uses word-based comparison (ignoring words < 3 characters)
- Applies minimum similarity threshold (0.1) to filter relevant matches

**Fallback Strategy:**
- If sufficient similar examples found: Uses top 3 most similar issues
- If insufficient similar examples: Combines similar + recent issues to reach 3 examples
- Ensures AI always has relevant context without overwhelming the prompt

### 3. AI Integration
- Fetches issue details from Jira (title, description, subtasks)
- Retrieves tenant-specific story points table from Confluence
- Combines historical examples with current issue context
- Generates estimates with detailed reasoning in Portuguese

### 4. Data Flow
1. **Authentication**: Validates API key
2. **Cache Check**: Verifies if issue was already scored
3. **Issue Retrieval**: Fetches issue data from Jira API (only for new issues)
4. **Context Building**: Gets points table and historical examples
5. **AI Processing**: Sends structured prompt to AI model
6. **Response Parsing**: Extracts story points and reasoning
7. **Storage**: Saves result to history for future reference
8. **Formatting**: Returns response in requested format

## Setup

### Prerequisites
- Cloudflare Workers account
- D1 Database for storing historical data
- Environment variables configured

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables in `wrangler.toml`
4. Run database migrations
5. Deploy: `wrangler deploy`

### Development
1. Start local development: `wrangler dev`
2. API will be available at `http://localhost:8787`
3. Test endpoints using your preferred HTTP client

## Project Structure

```
src/
├── controllers/          # API route handlers
├── services/            # Business logic
├── infra/
│   ├── clients/         # External API clients (Jira, AI)
│   └── repositories/    # Data access layer
├── models/              # Data models
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
│   └── story-points/    # Story points specific utilities
├── enums/               # Enum definitions
└── index.ts            # Main application entry
```

## Key Components

- **Similarity Algorithm**: Intelligent matching of historical issues
- **Auto-cleanup**: Maintains optimal database size
- **Multi-format Output**: JSON, text, and markdown responses
- **Historical Learning**: Improves estimates based on past decisions
- **Tenant Isolation**: Multi-tenant support with data separation
