// GraphQL Queries for GitHub API
const { gql } = require('@apollo/client');

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
          url
          followers {
            totalCount
          }
          repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS_COUNT, direction: DESC}) {
            totalCount
            nodes {
              stargazerCount
              stargazers {
                totalCount
              }
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

// Get user details with all repositories stats
const USER_DETAILS = gql`
  query UserDetails($login: String!) {
    user(login: $login) {
      login
      name
      avatarUrl(size: 100)
      bio
      url
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS_COUNT, direction: DESC}) {
        totalCount
        nodes {
          name
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
        }
      }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalRepositoryContributions
        restrictedContributionsCount
      }
      createdAt
      updatedAt
    }
  }
`;

module.exports = {
  SEARCH_USERS,
  RATE_LIMIT,
  USER_DETAILS
};
