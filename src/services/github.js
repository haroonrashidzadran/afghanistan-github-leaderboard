const { GraphQLClient, gql } = require('graphql-request');
const config = require('../config');
const { SEARCH_USERS, RATE_LIMIT } = require('../graphql/queries');

/**
 * GitHub API Client using graphql-request
 * Lightweight GraphQL client without React dependencies
 */
class GitHubClient {
  constructor(token) {
    if (!token) {
      throw new Error('GitHub token is required. Set GITHUB_TOKEN or HRZ_Token environment variable.');
    }

    this.token = token;
    this.client = new GraphQLClient(config.github.apiUrl, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      timeout: config.api.timeout,
    });
    this.rateLimitRemaining = null;
  }

  /**
   * Check current rate limit status
   */
  async checkRateLimit() {
    try {
      const data = await this.client.request(RATE_LIMIT);
      this.rateLimitRemaining = data.rateLimit.remaining;
      console.log(`Rate Limit: ${data.rateLimit.remaining}/${data.rateLimit.limit}`);
      return {
        remaining: data.rateLimit.remaining,
        limit: data.rateLimit.limit,
        resetAt: data.rateLimit.resetAt
      };
    } catch (error) {
      console.warn('Could not fetch rate limit:', error.message);
      return null;
    }
  }

  /**
   * Search for users by location
   */
  async searchUsersByLocation(location, limit = 100) {
    const query = `location:${location} sort:followers`;
    
    try {
      const data = await this.client.request(SEARCH_USERS, {
        query,
        first: Math.min(limit, config.github.perPage),
        after: null
      });

      this.updateRateLimit(data);

      return {
        users: data.search.nodes,
        pageInfo: data.search.pageInfo,
        totalCount: data.search.userCount
      };
    } catch (error) {
      console.error(`Error searching users in ${location}:`, error.message);
      return { users: [], pageInfo: {}, totalCount: 0 };
    }
  }

  /**
   * Search all locations and collect users
   */
  async searchAllLocations() {
    const allUsers = new Map();
    const locations = config.github.searchLocations;

    console.log(`Searching for users in ${locations.length} locations...`);

    for (const location of locations) {
      console.log(`\n📍 Searching: ${location}`);
      
      let hasNextPage = true;
      let cursor = null;
      let fetchedCount = 0;

      while (hasNextPage && fetchedCount < config.github.maxUsers) {
        // Check rate limit
        if (this.rateLimitRemaining !== null && this.rateLimitRemaining < 100) {
          console.log('⚠️ Rate limit low, waiting...');
          await this.waitForRateLimit();
        }

        try {
          const data = await this.client.request(SEARCH_USERS, {
            query: `location:${location} sort:followers`,
            first: config.github.perPage,
            after: cursor
          });

          this.updateRateLimit(data);
          
          const users = data.search.nodes;
          
          for (const user of users) {
            if (!allUsers.has(user.login)) {
              allUsers.set(user.login, user);
            }
          }

          fetchedCount += users.length;
          hasNextPage = data.search.pageInfo.hasNextPage;
          cursor = data.search.pageInfo.endCursor;

          console.log(`  ✓ Fetched ${users.length} users (Total: ${allUsers.size})`);

          // Rate limiting delay
          await this.delay(config.api.rateLimitDelay);

        } catch (error) {
          console.error(`Error fetching page for ${location}:`, error.message);
          break;
        }
      }
    }

    console.log(`\n✅ Total unique users found: ${allUsers.size}`);
    return Array.from(allUsers.values());
  }

  /**
   * Update rate limit from response
   */
  updateRateLimit(data) {
    if (data?.rateLimit) {
      this.rateLimitRemaining = data.rateLimit.remaining;
    }
  }

  /**
   * Wait for rate limit to reset
   */
  async waitForRateLimit() {
    if (this.rateLimitRemaining !== null && this.rateLimitRemaining < 100) {
      console.log('⏳ Rate limit low, waiting 60 seconds...');
      await this.delay(60000);
      await this.checkRateLimit();
    }
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = GitHubClient;
