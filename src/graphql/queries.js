const { gql } = require('@apollo/client');

/**
 * GraphQL Queries for GitHub API
 * Optimized for gayanvoice/top-github-users format
 */

// Search for users in Afghanistan
const SEARCH_USERS = gql`
  query SearchUsers($query: String!, $after: String, $first: Int!) {
    search(query: $query, type: USER, first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      userCount
      nodes {
        ... on User {
          login
          name
          avatarUrl(size: 100)
          bio
          company
          twitterUsername
          location
          url
          followers {
            totalCount
          }
          repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS_COUNT, direction: DESC}) {
            totalCount
            nodes {
              stargazerCount
            }
          }
          contributionsCollection {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            totalRepositoryContributions
          }
          createdAt
          updatedAt
        }
      }
    }
  }
`;

// Get rate limit status
const RATE_LIMIT = gql`
  query RateLimit {
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
  }
`;

module.exports = {
  SEARCH_USERS,
  RATE_LIMIT
};
