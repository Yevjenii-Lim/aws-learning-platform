'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  RotateCcw,
  Brain,
  BookOpen,
  TrendingUp,
  Award,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import ClientOnly from '../../../components/ClientOnly';
import Header from '../../../components/Header';

interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  category: string;
  timeSpent?: number;
  correctAnswers: number;
  incorrectAnswers: number;
  categoryBreakdown: Record<string, { correct: number; total: number; percentage: number }>;
  questions: Array<{
    id: string;
    question: string;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    category: string;
  }>;
}

function QuizResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get quiz results from URL params or session storage
    const score = parseInt(searchParams.get('score') || '0');
    const totalQuestions = parseInt(searchParams.get('total') || '0');
    const category = searchParams.get('category') || 'all';
    const timeSpent = parseInt(searchParams.get('time') || '0');
    
    // Try to get detailed results from session storage
    const storedResults = sessionStorage.getItem('quizResults');
    
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        setResult(parsedResults);
        setLoading(false);
        
        // Save the quiz score to the database
        saveQuizScore(parsedResults);
      } catch (err) {
        console.error('Error parsing stored results:', err);
        setError('Failed to load quiz results');
        setLoading(false);
      }
    } else if (score > 0 && totalQuestions > 0) {
      // Fallback: create basic result from URL params
      const percentage = Math.round((score / totalQuestions) * 100);
      const basicResult: QuizResult = {
        score,
        totalQuestions,
        percentage,
        category,
        timeSpent,
        correctAnswers: score,
        incorrectAnswers: totalQuestions - score,
        categoryBreakdown: { [category]: { correct: score, total: totalQuestions, percentage } },
        questions: []
      };
      setResult(basicResult);
      setLoading(false);
      saveQuizScore(basicResult);
    } else {
      setError('No quiz results found');
      setLoading(false);
    }
  }, [searchParams]);

  const saveQuizScore = async (quizResult: QuizResult) => {
    try {
      setSaving(true);
      
      // Save quiz score
      const scoreResponse = await fetch('/api/users/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_quiz_score',
          data: {
            quizId: `quiz-${quizResult.category}-${Date.now()}`,
            score: quizResult.percentage
          }
        })
      });

      if (!scoreResponse.ok) {
        console.error('Failed to save quiz score');
      }

      // Add quiz activity to recent activity
      const activityResponse = await fetch('/api/users/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_quiz_activity',
          data: {
            category: quizResult.category,
            score: quizResult.score,
            totalQuestions: quizResult.totalQuestions
          }
        })
      });

      if (!activityResponse.ok) {
        console.error('Failed to add quiz activity');
      }
    } catch (err) {
      console.error('Error saving quiz data:', err);
    } finally {
      setSaving(false);
    }
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "Outstanding! You're an AWS expert!", emoji: "🏆", color: "text-yellow-600" };
    if (percentage >= 80) return { message: "Excellent work! You're doing great!", emoji: "🎉", color: "text-green-600" };
    if (percentage >= 70) return { message: "Good job! Keep up the learning!", emoji: "👍", color: "text-blue-600" };
    if (percentage >= 60) return { message: "Not bad! Review the topics and try again.", emoji: "📚", color: "text-orange-600" };
    return { message: "Keep studying! Practice makes perfect.", emoji: "💪", color: "text-red-600" };
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "from-green-400 to-green-600";
    if (percentage >= 60) return "from-blue-400 to-blue-600";
    return "from-orange-400 to-orange-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Calculating Results</h1>
          <p className="text-gray-600">Analyzing your quiz performance...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Results Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'No quiz results available'}</p>
          <Link href="/games/quizlet" className="aws-button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Take Another Quiz
          </Link>
        </div>
      </div>
    );
  }

  const performance = getPerformanceMessage(result.percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header
        title="Quiz Results"
        subtitle="Your AWS knowledge assessment"
        showBackButton={true}
        backUrl="/games"
        showGamesButton={false}
        customActions={
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {saving && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-aws-orange mr-2"></div>
                Saving...
              </div>
            )}
            <div className="flex items-center">
              <Trophy className="h-4 w-4 mr-1" />
              {result.percentage}%
            </div>
          </div>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Results Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          {/* Performance Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-6xl mb-4"
            >
              {performance.emoji}
            </motion.div>
            <h1 className={`text-3xl font-bold ${performance.color} mb-2`}>
              {performance.message}
            </h1>
            <div className={`text-6xl font-bold bg-gradient-to-r ${getPerformanceColor(result.percentage)} bg-clip-text text-transparent mb-2`}>
              {result.percentage}%
            </div>
            <p className="text-gray-600">
              {result.correctAnswers} out of {result.totalQuestions} questions correct
            </p>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{result.correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{result.incorrectAnswers}</div>
              <div className="text-sm text-gray-600">Incorrect Answers</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{result.totalQuestions}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
          </div>

          {/* Category Breakdown */}
          {Object.keys(result.categoryBreakdown).length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Performance by Category
              </h3>
              <div className="space-y-4">
                {Object.entries(result.categoryBreakdown).map(([category, stats]) => (
                  <div key={category} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 capitalize">{category}</span>
                      <span className="text-sm text-gray-600">
                        {stats.correct}/{stats.total} ({stats.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.percentage}%` }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className={`h-2 rounded-full ${
                          stats.percentage >= 80 ? 'bg-green-500' :
                          stats.percentage >= 60 ? 'bg-blue-500' : 'bg-orange-500'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Time Spent */}
          {result.timeSpent && result.timeSpent > 0 && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center">
                <Clock className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-gray-700">
                  Time spent: {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/games/quizlet"
            className="flex items-center justify-center px-6 py-3 bg-aws-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Take Another Quiz
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            View Progress
          </Link>
          <Link
            href="/games"
            className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Back to Games
          </Link>
        </div>

        {/* Improvement Suggestions */}
        {result.percentage < 80 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Tips for Improvement
            </h3>
            <ul className="space-y-2 text-yellow-700">
              <li>• Review the explanations for incorrect answers</li>
              <li>• Take tutorials in your weaker categories</li>
              <li>• Practice with flashcards to reinforce concepts</li>
              <li>• Try the quiz again after studying</li>
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function QuizResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Results</h1>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    }>
      <QuizResultsContent />
    </Suspense>
  );
}
