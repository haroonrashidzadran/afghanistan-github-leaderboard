const GitHubClient = require('./github');
const scoringEngine = require('./scoring');
const markdownGenerator = require('./markdown');
const config = require('../config');

/**
 * Main Leaderboard Processor
 * Generates markdown files in gayanvoice/top-github-users format
 */
class LeaderboardProcessor {
  constructor(token) {
    this.github = new GitHubClient(token);
  }

  /**
   * Process the complete leaderboard
   * @param {Object} options - Processing options
   * @returns {Object} - Results
   */
  async process(options = {}) {
    const { dryRun = false, saveFiles = true } = options;

    console.log('🚀 Starting Afghanistan GitHub Leaderboard Generation');
    console.log('='.repeat(60));

    try {
      // Check rate limit
      console.log('\n📊 Checking GitHub API rate limit...');
      await this.github.checkRateLimit();

      // Search for users
      console.log('\n🔍 Searching for Afghan developers...');
      const users = await this.github.searchAllLocations();

      if (users.length === 0) {
        console.log('⚠️ No users found!');
        return { success: false, users: [], error: 'No users found' };
      }

      // Calculate scores and rank users
      console.log('\n🏆 Calculating scores and ranking users...');
      const rankedUsers = scoringEngine.rankUsers(users);

      // Calculate statistics
      const stats = this.calculateStats(rankedUsers);

      console.log('\n📈 Statistics:');
      console.log(`  Total Users: ${stats.totalUsers}`);
      console.log(`  Total Contributions: ${stats.totalContributions.toLocaleString()}`);
      console.log(`  Total Stars: ${stats.totalStars.toLocaleString()}`);
      console.log(`  Total Followers: ${stats.totalFollowers.toLocaleString()}`);

      if (dryRun) {
        console.log('\n🧪 DRY RUN - Not saving files');
        console.log('Top 10 Users:');
        rankedUsers.slice(0, 10).forEach(user => {
          console.log(`  ${user.rank}. ${user.login} - Contributions: ${user.leaderboardScore.raw.contributions}`);
        });
      } else if (saveFiles) {
        // Generate main README
        console.log('\n📝 Generating README.md...');
        const readmeContent = markdownGenerator.generateMainReadme(rankedUsers, stats);
        markdownGenerator.saveMarkdown(readmeContent, 'README.md');

        // Generate public contributions markdown
        console.log('\n📁 Generating markdown/public_contributions/afghanistan.md...');
        const publicContribContent = markdownGenerator.generatePublicContributions(rankedUsers, {
          country: 'Afghanistan',
          cities: ['Kabul', 'Herat', 'Mazar', 'Kandahar', 'Jalalabad', 'Bamyan']
        });
        markdownGenerator.saveMarkdown(
          publicContribContent,
          'markdown/public_contributions/afghanistan.md'
        );

        // Generate JSON export
        console.log('\n💾 Generating leaderboard.json...');
        const jsonData = this.generateJSON(rankedUsers, stats);
        const jsonContent = JSON.stringify(jsonData, null, 2);
        require('fs').writeFileSync('leaderboard.json', jsonContent, 'utf8');
        console.log('✅ Saved: leaderboard.json');

        console.log('\n✅ Leaderboard generation complete!');
      }

      return {
        success: true,
        users: rankedUsers,
        stats,
        dryRun
      };

    } catch (error) {
      console.error('\n❌ Error during processing:', error.message);
      return {
        success: false,
        error: error.message,
        stack: error.stack
      };
    }
  }

  /**
   * Calculate overall statistics
   * @param {Array} users - Ranked users
   * @returns {Object}
   */
  calculateStats(users) {
    return {
      totalUsers: users.length,
      totalStars: users.reduce((sum, u) => sum + u.leaderboardScore.raw.totalStars, 0),
      totalFollowers: users.reduce((sum, u) => sum + u.leaderboardScore.raw.followers, 0),
      totalRepos: users.reduce((sum, u) => sum + u.leaderboardScore.raw.repos, 0),
      totalContributions: users.reduce((sum, u) => sum + u.leaderboardScore.raw.contributions, 0),
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Generate JSON export
   * @param {Array} users - Ranked users
   * @param {Object} stats - Statistics
   * @returns {Object}
   */
  generateJSON(users, stats) {
    return {
      metadata: {
        name: 'Afghanistan GitHub Leaderboard',
        generatedAt: new Date().toISOString(),
        totalUsers: stats.totalUsers,
        country: 'Afghanistan',
        version: '1.0.0'
      },
      statistics: stats,
      leaderboard: users.map(user => ({
        rank: user.rank,
        username: user.login,
        name: user.name,
        avatarUrl: user.avatarUrl,
        profileUrl: user.url,
        company: user.company || null,
        twitter: user.twitterUsername || null,
        location: user.location || null,
        score: user.leaderboardScore.totalScore,
        publicContributions: user.leaderboardScore.raw.contributions,
        stars: user.leaderboardScore.raw.totalStars,
        followers: user.leaderboardScore.raw.followers,
        repositories: user.leaderboardScore.raw.repos
      }))
    };
  }
}

module.exports = LeaderboardProcessor;
