#!/usr/bin/env node

/**
 * Afghanistan GitHub Leaderboard - Main Entry Point
 * 
 * This script fetches GitHub users from Afghanistan,
 * calculates their scores based on GitHub activity,
 * and generates a README leaderboard.
 * 
 * Usage:
 *   node src/index.js           - Run normally and update README
 *   node src/index.js --dry-run - Run without saving files
 *   node src/index.js --help    - Show help
 */

const LeaderboardProcessor = require('./services/processor');
const config = require('./config');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  dryRun: args.includes('--dry-run') || args.includes('-d'),
  help: args.includes('--help') || args.includes('-h')
};

// Show help
if (options.help) {
  console.log(`
🏆 Afghanistan GitHub Leaderboard

Usage:
  node src/index.js           Generate leaderboard and update README
  node src/index.js --dry-run Test run without saving files
  node src/index.js --help    Show this help message

Environment Variables:
  GITHUB_TOKEN or GH_TOKEN    GitHub Personal Access Token (required)

Configuration:
  Edit src/config/index.js to customize:
  - Search locations
  - Scoring weights
  - Display options
  `);
  process.exit(0);
}

// Main execution
async function main() {
  console.log('\n🦅 Afghanistan GitHub Leaderboard\n');

  // Validate token
  const token = config.github.token;
  if (!token) {
    console.error('❌ Error: GITHUB_TOKEN environment variable is required');
    console.error('   Set it in .env file or as environment variable');
    console.error('   Example: export GITHUB_TOKEN=your_token_here');
    process.exit(1);
  }

  // Check token format
  if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
    console.warn('⚠️ Warning: Token does not look like a GitHub PAT');
  }

  // Create processor and run
  const processor = new LeaderboardProcessor(token);
  
  try {
    const result = await processor.process(options);
    
    if (result.success) {
      console.log(`\n📊 Final Stats:`);
      console.log(`   Users ranked: ${result.stats.totalUsers}`);
      console.log(`   Total stars: ${result.stats.totalStars.toLocaleString()}`);
      console.log(`   Total followers: ${result.stats.totalFollowers.toLocaleString()}`);
      
      process.exit(0);
    } else {
      console.error(`\n❌ Failed: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n💥 Unexpected error:`, error.message);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run main function
main();
