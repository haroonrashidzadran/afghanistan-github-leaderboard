const GitHubClient = require('./github');
const scoringEngine = require('./scoring');
const readmeGenerator = require('./readme');
const config = require('../config');

/**
 * Main Leaderboard Processor
 * Orchestrates the entire leaderboard generation process
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
      console.log(`  Total Stars: ${stats.totalStars.toLocaleString()}`);
      console.log(`  Total Followers: ${stats.totalFollowers.toLocaleString()}`);

      if (dryRun) {
        console.log('\n🧪 DRY RUN - Not saving files');
        console.log('Top 5 Users:');
        rankedUsers.slice(0, 5).forEach(user => {
          console.log(`  ${user.rank}. ${user.login} - Score: ${user.leaderboardScore.totalScore}`);
        });
      } else {
        // Generate and save README
        console.log('\n📝 Generating README...');
        const readmeContent = readmeGenerator.generate(rankedUsers, stats);
        
        if (saveFiles) {
          readmeGenerator.saveReadme(readmeContent);
          
          // Generate JSON export
          console.log('\n💾 Generating JSON export...');
          const jsonData = readmeGenerator.generateJSON(rankedUsers, stats);
          readmeGenerator.saveJSON(jsonData);
        }

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
      lastUpdated: new Date().toISOString()
    };
  }
}

module.exports = LeaderboardProcessor;
