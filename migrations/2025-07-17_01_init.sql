CREATE TABLE IF NOT EXISTS StoryPointsHistories (
  id TEXT PRIMARY KEY,
  tenantId TEXT NOT NULL,
  issueKey TEXT NOT NULL,
  issueTitle TEXT NOT NULL,
  storyPoints INTEGER NOT NULL,
  reasoning TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  UNIQUE (tenantId, issueKey)
);

CREATE TABLE IF NOT EXISTS Tenants (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  contextDescription TEXT NOT NULL,
  atlassianDomain TEXT NOT NULL,
  atlassianEmail TEXT NOT NULL,
  atlassianToken TEXT NOT NULL,
  confluencePointsTablePageId TEXT NOT NULL,
  groqApiKey TEXT NOT NULL,
  isActive INTEGER DEFAULT 1
);