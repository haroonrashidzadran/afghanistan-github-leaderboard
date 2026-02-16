const fs = require('fs');
const path = require('path');

/**
 * Markdown Generator for GitHub Leaderboard
 * Creates files in the format of gayanvoice/top-github-users
 */
class MarkdownGenerator {
  constructor() {
    this.templateDir = path.join(__dirname, '..', 'templates');
  }

  /**
   * Generate public contributions markdown file
   * @param {Array} users - Array of ranked users
   * @param {Object} options - Generation options
   * @returns {string}
   */
  generatePublicContributions(users, options = {}) {
    const {
      country = 'Afghanistan',
      cities = ['Kabul', 'Herat', 'Mazar', 'Kandahar', 'Jalalabad', 'Bamyan'],
      date = new Date().toISOString().split('T')[0]
    } = options;

    // Filter users with at least 1 contribution
    const activeUsers = users.filter(u => 
      u.leaderboardScore.raw.contributions >= 1
    ).slice(0, 500);

    // Generate table rows
    const rows = activeUsers.map(user => this.generateRow(user)).join('\n');

    const citiesStr = cities.join(' ');
    const totalUsers = activeUsers.length;
    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });

    return `# Top GitHub Users By Public Contributions in Afghanistan

<div align="center">
<a href="https://github.com/haroonrashidzadran/afghanistan-github-leaderboard">
<img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Afghanistan.svg" alt="Afghanistan" width="200">
</a>
</div>

The \`public contributions\` by users in Afghanistan on \`${formattedDate}\`. This list contains users from \`${country}\` and cities \`${citiesStr}\`.

There are \`${totalUsers}\` users in Afghanistan. You need at least \`1\` contribution to be on this list.

| # | Name | Company | Twitter Username | Location | Public Contributions |
|---|------|---------|------------------|----------|----------------------|
${rows}
`;
  }

  /**
   * Generate a table row for a user
   * @param {Object} user - User object
   * @returns {string}
   */
  generateRow(user) {
    const rank = user.rank;
    const avatar = user.avatarUrl;
    const name = user.name || '';
    const login = user.login;
    const profileUrl = user.url;
    const company = this.getCompany(user);
    const twitter = this.getTwitter(user);
    const location = user.location || 'No Location';
    const contributions = user.leaderboardScore.raw.contributions;

    return `| ${rank} | <a href="${profileUrl}"><img src="${avatar}" width="24" alt="${login}"> ${login}</a><br/>${name} | ${company} | ${twitter} | ${location} | ${contributions} |`;
  }

  /**
   * Get company name from user
   * @param {Object} user - User object
   * @returns {string}
   */
  getCompany(user) {
    const company = user.company || '';
    if (!company) return 'No Company';
    return company.replace(/@/g, '');
  }

  /**
   * Get Twitter username from user
   * @param {Object} user - User object
   * @returns {string}
   */
  getTwitter(user) {
    const twitter = user.twitterUsername;
    if (!twitter) return 'No Twitter Username';
    return `<a href="https://twitter.com/${twitter}">${twitter}</a>`;
  }

  /**
   * Save markdown file
   * @param {string} content - Markdown content
   * @param {string} outputPath - Output file path
   * @returns {boolean}
   */
  saveMarkdown(content, outputPath) {
    try {
      // Ensure directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(outputPath, content, 'utf8');
      console.log(`✅ Saved: ${outputPath}`);
      return true;
    } catch (error) {
      console.error(`❌ Error saving ${outputPath}:`, error.message);
      return false;
    }
  }

  /**
   * Generate main README.md
   * @param {Array} users - Array of ranked users
   * @param {Object} stats - Statistics
   * @returns {string}
   */
  generateMainReadme(users, stats) {
    const topUsers = users.slice(0, 50);

    return `# 🦅 Afghanistan GitHub Leaderboard

<div align="center">

[![Top GitHub Users](https://github.com/haroonrashidzadran/afghanistan-github-leaderboard/actions/workflows/update-leaderboard.yml/badge.svg)](https://github.com/haroonrashidzadran/afghanistan-github-leaderboard/actions)

**A public leaderboard showcasing the top GitHub developers from Afghanistan**

*Auto-generated every 24 hours using GitHub Actions*

</div>

## 📊 About This Project

This leaderboard ranks GitHub users based in Afghanistan using public contributions as the primary metric.

## 📁 Available Lists

| List | Description |
|------|-------------|
| [Public Contributions](./markdown/public_contributions/afghanistan.md) | Top users by public contributions |

## 🏆 Top 50 Users

| # | Name | Score | ⭐ Stars | 👥 Followers | 📦 Repos | 📝 Contributions |
|---|------|-------|----------|-------------|----------|------------------|
${topUsers.map(u => `| ${u.rank} | [${u.login}](${u.url}) | **${u.leaderboardScore.totalScore}** | ${u.leaderboardScore.raw.totalStars} | ${u.leaderboardScore.raw.followers} | ${u.leaderboardScore.raw.repos} | ${u.leaderboardScore.raw.contributions} |`).join('\n')}

## 📈 Statistics

- **Total Users Ranked**: ${stats.totalUsers}
- **Total Stars**: ${stats.totalStars.toLocaleString()}
- **Total Followers**: ${stats.totalFollowers.toLocaleString()}
- **Total Contributions**: ${stats.totalContributions.toLocaleString()}

## 🔧 Technical Details

- **API**: GitHub GraphQL API
- **Schedule**: Every 24 hours via GitHub Actions
- **No Database**: Purely static, no backend required

## 🤝 Contributing

Feel free to fork and customize this project!

---

<div align="center">

**Built with ❤️ for the Afghan developer community**

*Last updated: ${new Date().toISOString()}*

</div>
`;
  }
}

module.exports = new MarkdownGenerator();
