// Configuration and Environment Variables
require('dotenv').config();

module.exports = {
  // GitHub Configuration
  github: {
    token: process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
    apiUrl: 'https://api.github.com/graphql',
    // Search locations for Afghan developers
    searchLocations: [
      'Afghanistan',
      'Kabul',
      'Herat',
      'Mazar',
      'Mazar-i-Sharif',
      'Kandahar',
      'Jalalabad',
      'Bamyan',
      'Bamiyan',
      'Khost',
      'Peshawar', // Afghan refugees
      'Pakista' // Afghan refugees in Pakistan
    ],
    // Pagination
    perPage: 100,
    maxUsers: 500 // Maximum users to fetch
  },
  
  // Scoring Weights
  scoring: {
    followers: 1.0,      // 1 point per follower
    stars: 5.0,          // 5 points per star received
    repos: 10.0,         // 10 points per public repo
    contributions: 0.5   // 0.5 points per contribution
  },
  
  // Display Settings
  display: {
    topUsers: 100,      // Number of users to show in README
    avatarSize: 40      // Avatar size in pixels
  },
  
  // API Settings
  api: {
    rateLimitDelay: 1000, // Delay between API calls (ms) for rate limiting
    timeout: 30000,        // Request timeout (ms)
    maxRetries: 3          // Maximum retry attempts
  }
};
