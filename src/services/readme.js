const fs = require('fs');
const path = require('path');

/**
 * README Generator
 * Creates the leaderboard README.md file
 */
class ReadmeGenerator {
  constructor() {
    this.templateDir = path.join(__dirname, '..', '..', 'templates');
  }

  /**
   * Generate README content
   * @param {Array} rankedUsers - Array of ranked users
   * @param {Object} stats - Statistics about the leaderboard
   * @returns {string}
   */
  generate(rankedUsers, stats) {
    const topUsers = rankedUsers.slice(0, 100);
    
    let readme = this.getHeader();
    readme += this.getStatsSection(stats);
    readme += this.getLeaderboardTable(topUsers);
    readme += this.getFooter();

    return readme;
  }

  /**
   * Get README header
   * @returns {string}
   */
  getHeader() {
    return `# 🦅 Afghanistan GitHub Leaderboard

<div align="center">

![GitHub Repo Stars](https://img.shields.io/github/stars/afghanistan-github-leaderboard?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/afghanistan-github-leaderboard?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/afghanistan-github-leaderboard?style=flat-square)
![License](https://img.shields.io/github/license/afghanistan-github-leaderboard?style=flat-square)

**A public leaderboard showcasing the top GitHub developers from Afghanistan**

*Auto-generated every 24 hours using GitHub Actions*

</div>

## 📊 About This Project

This leaderboard ranks GitHub users based in Afghanistan using a weighted scoring system:

- ⭐ **Stars Received**: 5 points per star
- 👥 **Followers**: 1 point per follower
- 📦 **Repositories**: 10 points per public repository
- 📝 **Contributions**: 0.5 points per contribution

**Formula**: \`Score = (Stars × 5) + (Followers × 1) + (Repos × 10) + (Contributions × 0.5)\`

## 🏆 Badges

| Rank | Badge | Description |
|------|-------|-------------|
| 🥇 1st | 🥇 | Gold Medal |
| 🥈 2nd | 🥈 | Silver Medal |
| 🥉 3rd | 🥉 | Bronze Medal |
| 4-10 | 🔥 | Top 10 Developer |
| 11-50 | ⭐ | Top 50 Developer |
| 51-100 | 👤 | Featured Developer |

---

`;
  }

  /**
   * Get statistics section
   * @param {Object} stats - Statistics object
   * @returns {string}
   */
  getStatsSection(stats) {
    return `## 📈 Leaderboard Statistics

<div align="center">

| Metric | Value |
|--------|-------|
| **Total Users Ranked** | ${stats.totalUsers} |
| **Total Stars** | ${stats.totalStars.toLocaleString()} |
| **Total Followers** | ${stats.totalFollowers.toLocaleString()} |
| **Total Repositories** | ${stats.totalRepos.toLocaleString()} |
| **Last Updated** | ${stats.lastUpdated} |

</div>

---

`;
  }

  /**
   * Generate leaderboard table
   * @param {Array} users - Array of ranked users
   * @returns {string}
   */
  getLeaderboardTable(users) {
    let table = `## 👥 Top Developers

<div align="center">

| Rank | User | Score | ⭐ Stars | 👥 Followers | 📦 Repos | 📝 Contributions |
|:----:|:-----|------:|--------:|------------:|--------:|-----------------:|\n`;

    for (const user of users) {
      const score = user.leaderboardScore;
      const avatar = user.avatarUrl;
      const name = user.name || user.login;
      const login = user.login;

      table += `| ${user.rank} ${user.badge} | <img src="${avatar}" width="20"> **[${login}](${user.url})**<br>${name || ''} | **${score.totalScore.toLocaleString()}** | ${score.raw.totalStars.toLocaleString()} | ${score.raw.followers.toLocaleString()} | ${score.raw.repos.toLocaleString()} | ${score.raw.contributions.toLocaleString()} |\n`;
    }

    table += `\n</div>\n\n---\n\n`;

    return table;
  }

  /**
   * Get README footer
   * @returns {string}
   */
  getFooter() {
    return `## 🔧 Technical Details

### How It Works

1. **GitHub GraphQL API** - Queries users with location set to Afghanistan
2. **Weighted Scoring** - Calculates rankings based on GitHub activity
3. **Auto-Update** - GitHub Actions runs every 24 hours
4. **No Database** - Purely static, no backend required

### Scoring Formula

\`\`\`
Score = (Total Stars Received × 5) 
      + (Followers × 1) 
      + (Public Repositories × 10) 
      + (Contributions × 0.5)
\`\`\`

### Setup Your Own

\`\`\`bash
# Clone this repository
git clone https://github.com/YOUR_USERNAME/afghanistan-github-leaderboard.git
cd afghanistan-github-leaderboard

# Install dependencies
npm install

# Set up GitHub token
cp .env.example .env
# Edit .env and add your GITHUB_TOKEN

# Run locally
npm start
\`\`\`

### Getting a GitHub Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Generate a new token (Classic)
3. Select scopes: \`repo\`, \`read:user\`, \`user:email\`
4. Copy the token and add it to repository secrets as \`GITHUB_TOKEN\`

## 📝 License

MIT License - feel free to fork and customize!

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

---

<div align="center">

**Built with ❤️ for the Afghan developer community**

*Last updated: ${new Date().toISOString()}*

</div>
`;
  }

  /**
   * Save README to file
   * @param {string} content - README content
   * @param {string} outputPath - Output file path
   */
  saveReadme(content, outputPath = 'README.md') {
    try {
      fs.writeFileSync(outputPath, content, 'utf8');
      console.log(`✅ README saved to ${outputPath}`);
      return true;
    } catch (error) {
      console.error(`❌ Error saving README: ${error.message}`);
      return false;
    }
  }

  /**
   * Generate JSON export
   * @param {Array} rankedUsers - Array of ranked users
   * @param {Object} stats - Statistics
   * @returns {Object}
   */
  generateJSON(rankedUsers, stats) {
    return {
      metadata: {
        name: 'Afghanistan GitHub Leaderboard',
        generatedAt: new Date().toISOString(),
        totalUsers: stats.totalUsers,
        version: '1.0.0'
      },
      statistics: stats,
      leaderboard: rankedUsers.map(user => ({
        rank: user.rank,
        badge: user.badge,
        username: user.login,
        name: user.name,
        avatarUrl: user.avatarUrl,
        profileUrl: user.url,
        score: user.leaderboardScore.totalScore,
        breakdown: user.leaderboardScore.scores,
        raw: user.leaderboardScore.raw
      }))
    };
  }

  /**
   * Save JSON export
   * @param {Object} data - JSON data
   * @param {string} outputPath - Output file path
   */
  saveJSON(data, outputPath = 'leaderboard.json') {
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      fs.writeFileSync(outputPath, jsonContent, 'utf8');
      console.log(`✅ JSON saved to ${outputPath}`);
      return true;
    } catch (error) {
      console.error(`❌ Error saving JSON: ${error.message}`);
      return false;
    }
  }
}

module.exports = new ReadmeGenerator();
