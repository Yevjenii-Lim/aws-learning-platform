'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  Award,
  Play,
  CheckCircle,
  BarChart3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  rarity: string;
  unlockedAt?: string;
}

interface UserStats {
  totalTutorials: number;
  totalQuizScores: number;
  averageQuizScore: number;
  totalTimeSpent: number;
  learningStreak: number;
  achievements: string[];
}

interface UserProgress {
  completedTutorials: Array<{
    tutorialId: string;
    title: string;
    estimatedTime: string;
    completedAt: string;
  }> | string[]; // Support both new and legacy formats
  quizScores: Record<string, number>;
  totalTimeSpent: number;
  lastActivity: string | null;
  learningStreak: number;
  achievements: string[];
  recentActivity?: Array<{
    type: 'tutorial' | 'quiz' | 'achievement';
    title: string;
    description: string;
    timestamp: string;
    link?: string;
  }>;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [recalculatingStreak, setRecalculatingStreak] = useState(false);
  const [addingTestData, setAddingTestData] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const [statsResponse, progressResponse, badgesResponse] = await Promise.all([
        fetch('/api/users/stats'),
        fetch('/api/users/progress'),
        fetch('/api/users/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get_badges', data: {} })
        })
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setProgress(progressData.progress);
      }

      if (badgesResponse.ok) {
        const badgesData = await badgesResponse.json();
        setBadges(badgesData.badges || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please log in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aws-orange mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    // Format the actual date and time
    const dateTimeString = date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    // Return relative time with actual date/time in parentheses
    if (diffInHours < 1) return `Just now (${dateTimeString})`;
    if (diffInHours < 24) return `${diffInHours}h ago (${dateTimeString})`;
    if (diffInDays === 1) return `Yesterday (${dateTimeString})`;
    if (diffInDays < 7) return `${diffInDays} days ago (${dateTimeString})`;
    return dateTimeString;
  };

  const recalculateStreak = async () => {
    setRecalculatingStreak(true);
    try {
      const response = await fetch('/api/users/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'recalculate_streak',
          data: {}
        })
      });

      if (response.ok) {
        // Refresh user data to show updated streak
        await fetchUserData();
      }
    } catch (error) {
      console.error('Error recalculating streak:', error);
    } finally {
      setRecalculatingStreak(false);
    }
  };

  const addTestActivities = async (days: number) => {
    setAddingTestData(true);
    try {
      const response = await fetch('/api/users/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_test_activities',
          data: { days }
        })
      });

      if (response.ok) {
        // Refresh user data to show updated streak
        await fetchUserData();
      }
    } catch (error) {
      console.error('Error adding test activities:', error);
    } finally {
      setAddingTestData(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h2>
            <p className="text-gray-600">Track your AWS learning progress</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last active</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(progress?.lastActivity)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tutorials Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTutorials}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-gray-900">{formatTime(stats.totalTimeSpent)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Quiz Average</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageQuizScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Learning Streak</p>
                <p className="text-2xl font-bold text-gray-900">{stats.learningStreak} days</p>
                {stats.learningStreak > 0 ? (
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.learningStreak === 1 ? 'Keep it up!' : 
                     stats.learningStreak < 7 ? 'Great consistency!' :
                     stats.learningStreak < 30 ? 'Amazing dedication!' : 'Legendary streak!'}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    No recent activity. Start learning to build your streak!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learning Streak Details */}
      {stats && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
              Learning Streak Details
            </h3>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-purple-600">{stats.learningStreak}</div>
              <div className="text-sm text-gray-600">days</div>
            </div>
          </div>
          
          <div className="space-y-3">
            {stats.learningStreak > 0 ? (
              <>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">Current Streak</span>
                  </div>
                  <span className="text-sm font-semibold text-purple-600">{stats.learningStreak} days</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">Streak Milestones</span>
                  </div>
                  <div className="flex space-x-2">
                    {[1, 7, 30, 100].map(milestone => (
                      <div
                        key={milestone}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          stats.learningStreak >= milestone
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                        title={`${milestone} day${milestone > 1 ? 's' : ''}`}
                      >
                        {milestone >= 100 ? '100' : milestone}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <strong>💡 Tip:</strong> Complete a tutorial or flashcard session each day to maintain your streak!
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">Current Streak</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">0 days</span>
                </div>
                
                <div className="text-sm text-gray-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <strong>🔥 Start Your Streak:</strong> Complete a tutorial or flashcard session today to begin building your learning streak!
                </div>
                
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <strong>💡 How it works:</strong> Your streak resets to 0 if you miss a day. Complete any learning activity daily to maintain your streak! The streak only counts consecutive days with activity.
                </div>
              </>
            )}
            
            <div className="flex justify-center space-x-2 pt-2">
              <button
                onClick={recalculateStreak}
                disabled={recalculatingStreak}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
              >
                {recalculatingStreak ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-purple-600 mr-2"></div>
                    Recalculating...
                  </>
                ) : (
                  '🔄 Recalculate Streak'
                )}
              </button>
              
              {/* Development test buttons */}
              <button
                onClick={() => addTestActivities(3)}
                disabled={addingTestData}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                title="Add 3 days of test activities"
              >
                {addingTestData ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600 mr-2"></div>
                    Adding...
                  </>
                ) : (
                  '🧪 Test 3 Days'
                )}
              </button>
              
              <button
                onClick={() => addTestActivities(7)}
                disabled={addingTestData}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                title="Add 7 days of test activities"
              >
                {addingTestData ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-green-600 mr-2"></div>
                    Adding...
                  </>
                ) : (
                  '🧪 Test 7 Days'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {progress?.recentActivity && progress.recentActivity.length > 0 ? (
          <div className="space-y-4">
            {progress.recentActivity
              .slice(0, showAllActivities ? progress.recentActivity.length : 5)
              .map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {activity.type === 'tutorial' && (
                    <BookOpen className="h-5 w-5 text-aws-orange" />
                  )}
                  {activity.type === 'quiz' && (
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  )}
                  {activity.type === 'achievement' && (
                    <Award className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.link ? (
                        <a 
                          href={activity.link} 
                          className="hover:text-aws-orange transition-colors"
                        >
                          {activity.title}
                        </a>
                      ) : (
                        activity.title
                      )}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDate(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                </div>
              </div>
            ))}
            {progress.recentActivity.length > 5 && (
              <div className="text-center">
                <button
                  onClick={() => setShowAllActivities(!showAllActivities)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-aws-orange bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  {showAllActivities ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Show All {progress.recentActivity.length} Activities
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : progress?.lastActivity ? (
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              Last activity: {formatDate(progress.lastActivity)}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              {progress.completedTutorials.length} tutorials completed
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              {Object.keys(progress.quizScores).length} quizzes taken
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No recent activity. Start learning to see your progress!</p>
        )}
      </div>

      {/* Badges & Achievements */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-yellow-600" />
          Badges & Achievements ({badges.length})
        </h3>
        {badges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div 
                key={badge.id} 
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  badge.rarity === 'legendary' ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100' :
                  badge.rarity === 'epic' ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100' :
                  badge.rarity === 'rare' ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100' :
                  'border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl flex-shrink-0">{badge.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{badge.name}</h4>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{badge.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        badge.rarity === 'legendary' ? 'bg-yellow-200 text-yellow-800' :
                        badge.rarity === 'epic' ? 'bg-purple-200 text-purple-800' :
                        badge.rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {badge.rarity.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">{badge.category}</span>
                    </div>
                    {badge.unlockedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Earned {new Date(badge.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-gray-500 mb-2">No badges earned yet</p>
            <p className="text-sm text-gray-400">Complete quizzes and tutorials to earn your first badge!</p>
          </div>
        )}
      </div>

    </div>
  );
} 