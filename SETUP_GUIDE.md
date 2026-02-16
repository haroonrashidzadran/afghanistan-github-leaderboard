# 🦅 Afghanistan GitHub Leaderboard - Setup Guide

## Prerequisites

- **Node.js 18 or higher** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **GitHub Account** - [Sign up](https://github.com/)

## Quick Setup

### Option 1: Automated Setup (Windows)

```powershell
.\setup.bat
```

### Option 2: Manual Setup (All Platforms)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/afghanistan-github-leaderboard.git
cd afghanistan-github-leaderboard

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env and add your token
# Windows: notepad .env
# Linux/macOS: nano .env
```

### Option 3: Fork & Setup

1. **Fork this repository**
   - Go to [GitHub Repository](https://github.com/afghanistan-github-leaderboard)
   - Click "Fork" button
   - Choose your account

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/afghanistan-github-leaderboard.git
   cd afghanistan-github-leaderboard
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

## Step 1: Create GitHub Token

1. Go to [GitHub Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (Classic)"
3. Give it a descriptive name: `GitHub Leaderboard`
4. Select scopes:
   - ✅ `repo` - Full control of private repositories
   - ✅ `read:user` - Read user profile data
   - ✅ `user:email` - Read user email addresses
5. Click "Generate token"
6. **Copy the token** (starts with `ghp_`)

## Step 2: Add Token to Repository

### Option A: Local Development (.env file)

```bash
# Create/edit .env file
echo "GITHUB_TOKEN=your_token_here" > .env

# Or use environment variable
export GITHUB_TOKEN=your_token_here
```

### Option B: GitHub Actions (Repository Secret)

1. Go to your repository on GitHub
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click "New repository secret"
4. Name: `GITHUB_TOKEN`
5. Value: Paste your GitHub token
6. Click "Add secret"

## Step 3: Test Locally

```bash
# Dry run (test without saving files)
npm test

# Run and update README
npm start
```

## Step 4: Deploy to GitHub

### Option A: Push and Enable Actions

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/afghanistan-github-leaderboard.git

# Push to GitHub
git push -u origin main
```

### Option B: Enable GitHub Actions

1. Go to your repository on GitHub
2. Click "Actions" tab
3. You should see the "Update Leaderboard" workflow
4. Click "Enable workflow"

### Option C: Manual Trigger

1. Go to repository → Actions → Update Leaderboard
2. Click "Run workflow"
3. Select branch (main) and click "Run workflow"

## Verification

After the workflow runs:

1. Check the README.md is updated with user data
2. Check `leaderboard.json` is created
3. Check Actions tab for successful run

## Customization

### Edit Configuration

Open `src/config/index.js`:

```javascript
// Add/remove search locations
searchLocations: [
  'Afghanistan',
  'Kabul',
  'Herat',
  'Mazar-i-Sharif',
  'Kandahar',
  'Jalalabad',
  'Bamyan',
  'Pakistan', // Afghan refugees
],

// Adjust scoring weights
scoring: {
  followers: 1.0,    // Points per follower
  stars: 5.0,        // Points per star
  repos: 10.0,       // Points per repo
  contributions: 0.5 // Points per contribution
},
```

### Change Schedule

Edit `.github/workflows/update-leaderboard.yml`:

```yaml
schedule:
  # Run every 24 hours at midnight UTC
  - cron: '0 0 * * *'
  
  # Or run every 6 hours:
  # - cron: '0 */6 * * *'
  
  # Or run weekly:
  # - cron: '0 0 * * 0'  # Every Sunday
```

## Troubleshooting

### "GITHUB_TOKEN environment variable is required"

1. Make sure `.env` file exists with `GITHUB_TOKEN=your_token`
2. Or add secret to GitHub repository settings
3. For GitHub Actions, ensure the secret is named `GITHUB_TOKEN`

### Rate Limit Errors

GitHub API has rate limits:
- Unauthenticated: 60 requests/hour
- Authenticated: 5,000 requests/hour

If you hit rate limits:
1. Wait 1 hour
2. Use a token (increases limit)
3. Reduce `maxUsers` in config

### No Users Found

1. Check spelling of locations in config
2. GitHub search is case-insensitive
3. Some users may not have location set
4. Try different location variations

### Action Fails with Permission Error

1. Go to Settings → Actions → General
2. Under "Workflow permissions", enable:
   - ✅ Read and write permissions
3. Save changes

## Support

- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Email**: Contact the maintainers

## License

MIT License - See [LICENSE](LICENSE) for details.
