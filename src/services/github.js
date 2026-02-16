const { ApolloClient, InMemoryCache, createHttpLink, gql } = require('@apollo/client');
const { setContext } = require('@apollo/client/link/context');
const config = require('../config');
const { SEARCH_USERS, RATE_LIMIT } = require('./queries');

/**
 * GitHub API Client
 * Handles all GraphQL interactions with GitHub
 */
class GitHubClient {
  constructor(token) {
    if (!token) {
      throw new Error('GitHub token is required. Set GITHUB_TOKEN or GH_TOKEN environment variable.');
    }

    this.token = token;
    this.client = this.createClient();
    this.rateLimitRemaining = null;
  }

  /**
   * Create Apollo Client with authentication
   */
  createClient() {
    const httpLink = createHttpLink({
      uri: config.github.apiUrl,
      fetchOptions: {
        timeout: config.api.timeout
      }
    });

    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        authorization: `Bearer ${this.token}`
      }
    }));

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache'
        },
        query: {
          fetchPolicy: 'no-cache'
        }
      }
    });
  }

  /**
   * Check current rate limit status
   */
  async checkRateLimit() {
    try {
      const result = await this.client.query({
        query: RATE_LIMIT,
        fetchPolicy: 'no-cache'
      });

      this.rateLimitRemaining = result.data.rateLimit.remaining;
      
      console.log(`Rate Limit: ${result.data.rateLimit.remaining}/${result.data.rateLimit.limit}`);
      
      return {
        remaining: result.data.rateLimit.remaining,
        limit: result.data.rateLimit.limit,
        resetAt: result.data.rateLimit.resetAt
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
      const result = await this.client.query({
        query: SEARCH_USERS,
        variables: {
          query,
          first: Math.min(limit, config.github.perPage),
          after: null
        },
        fetchPolicy: 'no-cache'
      });

      this.updateRateLimit(result);

      return {
        users: result.data.search.nodes,
        pageInfo: result.data.search.pageInfo,
        totalCount: result.data.search.userCount
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
          const result = await this.client.query({
            query: SEARCH_USERS,
            variables: {
              query: `location:${location} sort:followers`,
              first: config.github.perPage,
              after: cursor
            },
            fetchPolicy: 'no-cache',
            errorPolicy: 'all'
          });

          this.updateRateLimit(result);
          
          if (result.errors) {
            console.error(`GraphQL errors:`, result.errors);
            break;
          }

          const users = result.data.search.nodes;
          
          for (const user of users) {
            if (!allUsers.has(user.login)) {
              allUsers.set(user.login, user);
            }
          }

          fetchedCount += users.length;
          hasNextPage = result.data.search.pageInfo.hasNextPage;
          cursor = result.data.search.pageInfo.endCursor;

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
  updateRateLimit(result) {
    if (result.data?.rateLimit) {
      this.rateLimitRemaining = result.data.rateLimit.remaining;
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
