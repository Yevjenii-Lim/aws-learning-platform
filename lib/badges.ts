// Badge system for AWS Learning Platform
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'quiz' | 'tutorial' | 'streak' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria: {
    type: 'quiz_score' | 'quiz_count' | 'tutorial_count' | 'streak_days' | 'time_spent' | 'category_mastery' | 'perfect_score';
    value: number;
    category?: string; // For category-specific badges
  };
  unlockedAt?: string;
}

export const BADGE_DEFINITIONS: Badge[] = [
  // Quiz Performance Badges
  {
    id: 'first_quiz',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🎯',
    color: 'blue',
    category: 'quiz',
    rarity: 'common',
    criteria: { type: 'quiz_count', value: 1 }
  },
  {
    id: 'quiz_enthusiast',
    name: 'Quiz Enthusiast',
    description: 'Complete 5 quizzes',
    icon: '🧠',
    color: 'green',
    category: 'quiz',
    rarity: 'common',
    criteria: { type: 'quiz_count', value: 5 }
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Complete 20 quizzes',
    icon: '🏆',
    color: 'purple',
    category: 'quiz',
    rarity: 'rare',
    criteria: { type: 'quiz_count', value: 20 }
  },
  {
    id: 'quiz_legend',
    name: 'Quiz Legend',
    description: 'Complete 50 quizzes',
    icon: '👑',
    color: 'gold',
    category: 'quiz',
    rarity: 'legendary',
    criteria: { type: 'quiz_count', value: 50 }
  },

  // Score-based Badges
  {
    id: 'good_start',
    name: 'Good Start',
    description: 'Score 70% or higher on a quiz',
    icon: '👍',
    color: 'green',
    category: 'quiz',
    rarity: 'common',
    criteria: { type: 'quiz_score', value: 70 }
  },
  {
    id: 'excellent_work',
    name: 'Excellent Work',
    description: 'Score 85% or higher on a quiz',
    icon: '⭐',
    color: 'blue',
    category: 'quiz',
    rarity: 'rare',
    criteria: { type: 'quiz_score', value: 85 }
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Score 100% on a quiz',
    icon: '💯',
    color: 'gold',
    category: 'quiz',
    rarity: 'epic',
    criteria: { type: 'perfect_score', value: 100 }
  },

  // Category Mastery Badges
  {
    id: 'networking_novice',
    name: 'Networking Novice',
    description: 'Score 80%+ in Networking category',
    icon: '🌐',
    color: 'blue',
    category: 'quiz',
    rarity: 'common',
    criteria: { type: 'category_mastery', value: 80, category: 'networking' }
  },
  {
    id: 'compute_expert',
    name: 'Compute Expert',
    description: 'Score 80%+ in Compute category',
    icon: '💻',
    color: 'green',
    category: 'quiz',
    rarity: 'common',
    criteria: { type: 'category_mastery', value: 80, category: 'compute' }
  },
  {
    id: 'storage_specialist',
    name: 'Storage Specialist',
    description: 'Score 80%+ in Storage category',
    icon: '💾',
    color: 'purple',
    category: 'quiz',
    rarity: 'common',
    criteria: { type: 'category_mastery', value: 80, category: 'storage' }
  },
  {
    id: 'security_guardian',
    name: 'Security Guardian',
    description: 'Score 80%+ in Security category',
    icon: '🔒',
    color: 'red',
    category: 'quiz',
    rarity: 'common',
    criteria: { type: 'category_mastery', value: 80, category: 'security' }
  },
  {
    id: 'database_wizard',
    name: 'Database Wizard',
    description: 'Score 80%+ in Database category',
    icon: '🗄️',
    color: 'orange',
    category: 'quiz',
    rarity: 'common',
    criteria: { type: 'category_mastery', value: 80, category: 'database' }
  },

  // Tutorial Badges
  {
    id: 'first_tutorial',
    name: 'Getting Started',
    description: 'Complete your first tutorial',
    icon: '📚',
    color: 'blue',
    category: 'tutorial',
    rarity: 'common',
    criteria: { type: 'tutorial_count', value: 1 }
  },
  {
    id: 'dedicated_learner',
    name: 'Dedicated Learner',
    description: 'Complete 10 tutorials',
    icon: '🎓',
    color: 'green',
    category: 'tutorial',
    rarity: 'rare',
    criteria: { type: 'tutorial_count', value: 10 }
  },
  {
    id: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    description: 'Complete 25 tutorials',
    icon: '🔍',
    color: 'purple',
    category: 'tutorial',
    rarity: 'epic',
    criteria: { type: 'tutorial_count', value: 25 }
  },

  // Streak Badges
  {
    id: 'daily_learner',
    name: 'Daily Learner',
    description: 'Maintain a 3-day learning streak',
    icon: '🔥',
    color: 'orange',
    category: 'streak',
    rarity: 'common',
    criteria: { type: 'streak_days', value: 3 }
  },
  {
    id: 'consistent_learner',
    name: 'Consistent Learner',
    description: 'Maintain a 7-day learning streak',
    icon: '⚡',
    color: 'blue',
    category: 'streak',
    rarity: 'rare',
    criteria: { type: 'streak_days', value: 7 }
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintain a 30-day learning streak',
    icon: '🌟',
    color: 'purple',
    category: 'streak',
    rarity: 'epic',
    criteria: { type: 'streak_days', value: 30 }
  },
  {
    id: 'streak_legend',
    name: 'Streak Legend',
    description: 'Maintain a 100-day learning streak',
    icon: '🏅',
    color: 'gold',
    category: 'streak',
    rarity: 'legendary',
    criteria: { type: 'streak_days', value: 100 }
  },

  // Time-based Badges
  {
    id: 'time_investor',
    name: 'Time Investor',
    description: 'Spend 10 hours learning',
    icon: '⏰',
    color: 'green',
    category: 'milestone',
    rarity: 'common',
    criteria: { type: 'time_spent', value: 600 } // 10 hours in minutes
  },
  {
    id: 'dedicated_student',
    name: 'Dedicated Student',
    description: 'Spend 50 hours learning',
    icon: '📖',
    color: 'blue',
    category: 'milestone',
    rarity: 'rare',
    criteria: { type: 'time_spent', value: 3000 } // 50 hours in minutes
  },
  {
    id: 'learning_champion',
    name: 'Learning Champion',
    description: 'Spend 100 hours learning',
    icon: '🏆',
    color: 'purple',
    category: 'milestone',
    rarity: 'epic',
    criteria: { type: 'time_spent', value: 6000 } // 100 hours in minutes
  },

  // Special Achievement Badges
  {
    id: 'aws_explorer',
    name: 'AWS Explorer',
    description: 'Master all AWS service categories',
    icon: '☁️',
    color: 'gold',
    category: 'special',
    rarity: 'legendary',
    criteria: { type: 'category_mastery', value: 80, category: 'all' }
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a quiz in under 2 minutes',
    icon: '⚡',
    color: 'yellow',
    category: 'special',
    rarity: 'epic',
    criteria: { type: 'quiz_score', value: 0 } // Special case for speed
  }
];

// Function to check if a user qualifies for a badge
export function checkBadgeEligibility(
  badge: Badge,
  userProgress: {
    quizScores: Record<string, number>;
    completedTutorials: any[];
    totalTimeSpent: number;
    learningStreak: number;
    recentActivity: any[];
  },
  quizResult?: {
    score: number;
    totalQuestions: number;
    category: string;
    timeSpent: number;
  }
): boolean {
  const { criteria } = badge;

  switch (criteria.type) {
    case 'quiz_count':
      return Object.keys(userProgress.quizScores).length >= criteria.value;

    case 'quiz_score':
      if (quizResult) {
        const percentage = Math.round((quizResult.score / quizResult.totalQuestions) * 100);
        return percentage >= criteria.value;
      }
      // Check if any quiz score meets the criteria
      return Object.values(userProgress.quizScores).some(score => score >= criteria.value);

    case 'perfect_score':
      if (quizResult) {
        return quizResult.score === quizResult.totalQuestions;
      }
      return Object.values(userProgress.quizScores).some(score => score === 100);

    case 'tutorial_count':
      return userProgress.completedTutorials.length >= criteria.value;

    case 'streak_days':
      return userProgress.learningStreak >= criteria.value;

    case 'time_spent':
      return userProgress.totalTimeSpent >= criteria.value;

    case 'category_mastery':
      if (criteria.category === 'all') {
        // Check if user has mastered all categories (this would need category-specific scores)
        // For now, return false as this is a complex check
        return false;
      }
      // This would need category-specific quiz scores to be implemented
      return false;

    default:
      return false;
  }
}

// Function to get all badges a user has earned
export function getUserBadges(
  userProgress: {
    quizScores: Record<string, number>;
    completedTutorials: any[];
    totalTimeSpent: number;
    learningStreak: number;
    recentActivity: any[];
    achievements: string[];
  },
  quizResult?: {
    score: number;
    totalQuestions: number;
    category: string;
    timeSpent: number;
  }
): Badge[] {
  const earnedBadges: Badge[] = [];
  const currentTime = new Date().toISOString();

  for (const badge of BADGE_DEFINITIONS) {
    // Check if user already has this badge
    if (userProgress.achievements.includes(badge.id)) {
      const existingBadge = { ...badge, unlockedAt: currentTime };
      earnedBadges.push(existingBadge);
      continue;
    }

    // Check if user qualifies for this badge
    if (checkBadgeEligibility(badge, userProgress, quizResult)) {
      const newBadge = { ...badge, unlockedAt: currentTime };
      earnedBadges.push(newBadge);
    }
  }

  return earnedBadges;
}

// Function to get newly earned badges
export function getNewlyEarnedBadges(
  userProgress: {
    quizScores: Record<string, number>;
    completedTutorials: any[];
    totalTimeSpent: number;
    learningStreak: number;
    recentActivity: any[];
    achievements: string[];
  },
  quizResult?: {
    score: number;
    totalQuestions: number;
    category: string;
    timeSpent: number;
  }
): Badge[] {
  const allBadges = getUserBadges(userProgress, quizResult);
  return allBadges.filter(badge => !userProgress.achievements.includes(badge.id));
}

// Function to get badge by ID
export function getBadgeById(badgeId: string): Badge | undefined {
  return BADGE_DEFINITIONS.find(badge => badge.id === badgeId);
}

// Function to get badges by category
export function getBadgesByCategory(category: Badge['category']): Badge[] {
  return BADGE_DEFINITIONS.filter(badge => badge.category === category);
}

// Function to get badges by rarity
export function getBadgesByRarity(rarity: Badge['rarity']): Badge[] {
  return BADGE_DEFINITIONS.filter(badge => badge.rarity === rarity);
}
