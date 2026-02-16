# Afghanistan GitHub Leaderboard - Project Structure

```
afghanistan-github-leaderboard/
├── .github/
│   └── workflows/
│       └── update-leaderboard.yml    # GitHub Actions workflow
├── markdown/
│   └── public_contributions/
│       └── afghanistan.md            # Public contributions leaderboard
├── src/
│   ├── config/
│   │   └── index.js                  # Configuration (locations, weights)
│   ├── graphql/
│   │   └── queries.js                # GraphQL queries
│   ├── services/
│   │   ├── github.js                 # GitHub API client
│   │   ├── markdown.js               # Markdown generator
│   │   ├── processor.js              # Main processing logic
│   │   └── scoring.js                # Scoring engine
│   └── index.js                      # Entry point
├── templates/
│   └── afghanistan.md.template       # Template for markdown output
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md                         # Main README
└── SETUP_GUIDE.md                   # Setup instructions
```

## Output Files

| File | Description |
|------|-------------|
| `README.md` | Main README with stats and links |
| `markdown/public_contributions/afghanistan.md` | Public contributions leaderboard |
| `leaderboard.json` | JSON export of all user data |
