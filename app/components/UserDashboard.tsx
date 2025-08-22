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
  BarChart3
} from 'lucide-react';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const [statsResponse, progressResponse] = await Promise.all([
        fetch('/api/users/stats'),
        fetch('/api/users/progress')
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setProgress(progressData.progress);
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {progress?.recentActivity && progress.recentActivity.length > 0 ? (
          <div className="space-y-4">
            {progress.recentActivity.slice(0, 5).map((activity, index) => (
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
              <p className="text-sm text-gray-500 text-center">
                And {progress.recentActivity.length - 5} more activities...
              </p>
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

      {/* Achievements */}
      {stats?.achievements && stats.achievements.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <Award className="h-5 w-5 text-yellow-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-aws-orange hover:bg-orange-50 transition-colors">
            <Play className="h-5 w-5 mr-2 text-aws-orange" />
            <span className="font-medium">Continue Learning</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-aws-orange hover:bg-orange-50 transition-colors">
            <Trophy className="h-5 w-5 mr-2 text-aws-orange" />
            <span className="font-medium">Take Quiz</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-aws-orange hover:bg-orange-50 transition-colors">
            <BookOpen className="h-5 w-5 mr-2 text-aws-orange" />
            <span className="font-medium">View Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
} 