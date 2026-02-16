const config = require('../config');

/**
 * Scoring System for GitHub Leaderboard
 * Calculates a weighted score based on user statistics
 */
class ScoringEngine {
  /**
   * Calculate overall score for a user
   * @param {Object} user - GitHub user object
   * @returns {Object} - Score details and total
   */
  calculateScore(user) {
    const weights = config.scoring;
    
    // Extract values with defaults
    const followers = user.followers?.totalCount || 0;
    const totalStars = this.calculateTotalStars(user);
    const repos = user.repositories?.totalCount || 0;
    const contributions = this.getTotalContributions(user);

    // Calculate individual scores
    const scores = {
      followers: followers * weights.followers,
      stars: totalStars * weights.stars,
      repos: repos * weights.repos,
      contributions: contributions * weights.contributions
    };

    // Total weighted score
    const totalScore = Object.values(scores).reduce((sum, val) => sum + val, 0);

    return {
      scores,
      totalScore: Math.round(totalScore * 100) / 100, // Round to 2 decimals
      raw: {
        followers,
        totalStars,
        repos,
        contributions
      }
    };
  }

  /**
   * Calculate total stars received across all repos
   * @param {Object} user - GitHub user object
   * @returns {number}
   */
  calculateTotalStars(user) {
    if (!user.repositories?.nodes) {
      return 0;
    }

    return user.repositories.nodes.reduce((total, repo) => {
      return total + (repo.stargazerCount || 0);
    }, 0);
  }

  /**
   * Get total contributions across all collections
   * @param {Object} user - GitHub user object
   * @returns {number}
   */
  getTotalContributions(user) {
    const contributions = user.contributionsCollection;
    
    if (!contributions) {
      return 0;
    }

    return (
      contributions.totalCommitContributions +
      contributions.totalPullRequestContributions +
      contributions.totalIssueContributions +
      contributions.totalRepositoryContributions
    );
  }

  /**
   * Rank users by score
   * @param {Array} users - Array of GitHub users
   * @returns {Array} - Sorted and ranked users
   */
  rankUsers(users) {
    // Calculate scores for all users
    const scoredUsers = users.map(user => ({
      ...user,
      leaderboardScore: this.calculateScore(user)
    }));

    // Sort by total score descending
    scoredUsers.sort((a, b) => b.leaderboardScore.totalScore - a.leaderboardScore.totalScore);

    // Assign ranks
    return scoredUsers.map((user, index) => ({
      ...user,
      rank: index + 1,
      badge: this.getBadge(index + 1),
      trend: this.calculateTrend(user, index)
    }));
  }

  /**
   * Get badge for top ranks
   * @param {number} rank - User's rank
   * @returns {string}
   */
  getBadge(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 10) return '🔥';
    if (rank <= 50) return '⭐';
    if (rank <= 100) return '👤';
    return '';
  }

  /**
   * Calculate trend indicator
   * Note: This would require storing previous scores to compare
   * @param {Object} user - Current user data
   * @param {number} currentRank - Current rank
   * @returns {string}
   */
  calculateTrend(user, currentRank) {
    // Placeholder for trend calculation
    // In a full implementation, you'd compare with stored previous ranks
    return '';
  }

  /**
   * Get score breakdown for display
   * @param {Object} scoreData - Score data object
   * @returns {string}
   */
  getScoreBreakdown(scoreData) {
    return `⭐ ${scoreData.raw.totalStars} | 👥 ${scoreData.raw.followers} | 📦 ${scoreData.raw.repos} | 📝 ${scoreData.raw.contributions}`;
  }
}

module.exports = new ScoringEngine();
