# Afghanistan GitHub Leaderboard

## Project Structure

```
afghanistan-github-leaderboard/
├── .github/
│   └── workflows/
│       └── update-leaderboard.yml    # GitHub Actions workflow
├── src/
│   ├── config/
│   │   └── index.js                  # Configuration (locations, weights)
│   ├── graphql/
│   │   └── queries.js                # GraphQL queries
│   ├── services/
│   │   ├── github.js                  # GitHub API client
│   │   ├── processor.js               # Main processing logic
│   │   ├── readme.js                  # README generator
│   │   └── scoring.js                 # Scoring engine
│   └── index.js                       # Entry point
├── .env.example                       # Environment template
├── .gitignore
├── CONTRIBUTING.md
├── package.json
├── package-lock.json
└── README.md                          # Auto-generated leaderboard
```

## Quick Start

```bash
# Install dependencies
npm install

# Set up GitHub token
cp .env.example .env
# Edit .env and add your GitHub token

# Run locally (dry run - no files saved)
npm test

# Run and update README
npm start
```

## Configuration

Edit `src/config/index.js` to customize:

- **Search Locations**: Add/remove locations to search
- **Scoring Weights**: Adjust the scoring formula
- **Display Options**: Change top users count, avatar size
- **API Settings**: Adjust rate limiting and timeouts

## GitHub Actions

The workflow runs automatically every 24 hours to:
1. Fetch the latest user data
2. Recalculate scores
3. Update README.md
4. Commit changes

You can also trigger it manually from the Actions tab.
