'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  RotateCcw,
  Target,
  Clock,
  Trophy,
  Brain,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import ClientOnly from '../../components/ClientOnly';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  tags: string[];
}

const categories = ['all', 'networking', 'compute', 'storage', 'security', 'database', 'monitoring'];

export default function QuizletPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Fetch quiz questions on component mount
  useEffect(() => {
    fetchQuizQuestions();
  }, []);

  // Fetch quiz questions when category changes
  useEffect(() => {
    if (selectedCategory !== 'all') {
      fetchQuizQuestionsByCategory();
    } else {
      fetchQuizQuestions();
    }
  }, [selectedCategory]);

  const fetchQuizQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/quiz');
      const result = await response.json();
      
      if (result.success && result.data) {
        setQuizQuestions(result.data);
        setTotalQuestions(result.data.length);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScore(0);
      } else {
        setError('Failed to load quiz questions');
      }
    } catch (err) {
      console.error('Error fetching quiz questions:', err);
      setError('Failed to load quiz questions');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizQuestionsByCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/quiz?category=${selectedCategory}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setQuizQuestions(result.data);
        setTotalQuestions(result.data.length);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScore(0);
      } else {
        setError('Failed to load quiz questions');
      }
    } catch (err) {
      console.error('Error fetching quiz questions:', err);
      setError('Failed to load quiz questions');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (answerIndex: number) => {
    if (showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">☁️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Quiz</h1>
          <p className="text-gray-600">Fetching quiz questions from AWS DynamoDB...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Quiz</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchQuizQuestions} className="aws-button">
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (quizQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Quiz Questions Available</h1>
          <p className="text-gray-600 mb-4">Try selecting a different category.</p>
          <Link href="/games" className="aws-button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/games" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AWS Quiz</h1>
                <p className="text-sm text-gray-600">Test your AWS knowledge</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Target className="h-4 w-4 mr-1" />
                {score}/{totalQuestions}
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {currentQuestionIndex + 1} of {quizQuestions.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-aws-orange text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-aws-orange h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="mb-6">
            <div className="mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {currentQuestion.category}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswer === index
                    ? index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : showExplanation && index === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${showExplanation ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50'}`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selectedAnswer === index
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-red-500 bg-red-500 text-white'
                      : showExplanation && index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index && (
                      index === currentQuestion.correctAnswer ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />
                    )}
                    {showExplanation && index === currentQuestion.correctAnswer && selectedAnswer !== index && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-gray-700">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <h3 className="font-semibold text-blue-900 mb-2">Explanation:</h3>
              <p className="text-blue-800">{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentQuestionIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </button>

          {currentQuestionIndex < quizQuestions.length - 1 ? (
            <button
              onClick={nextQuestion}
              disabled={!showExplanation}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !showExplanation
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-aws-orange text-white hover:bg-orange-600'
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <Link
              href="/games"
              className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700"
            >
              Finish Quiz
              <Trophy className="h-4 w-4 ml-2" />
            </Link>
          )}
        </div>

        {/* Reset Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={resetQuiz}
            className="flex items-center px-6 py-3 rounded-md text-sm font-medium bg-gray-800 text-white hover:bg-gray-700"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Quiz
          </button>
        </div>
      </div>
    </div>
  );
} 