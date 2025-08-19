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
  BookOpen,
  Cloud,
  Server,
  Database,
  Shield,
  Monitor,
  HardDrive
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

interface Topic {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  questionCount: number;
}

const topics: Topic[] = [
  {
    id: 'networking',
    name: 'Networking',
    description: 'Test your knowledge of VPC, CloudFront, and network architecture',
    icon: <Cloud className="h-8 w-8" />,
    color: 'bg-blue-500',
    questionCount: 0
  },
  {
    id: 'compute',
    name: 'Compute',
    description: 'Challenge yourself with EC2, Lambda, and serverless computing',
    icon: <Server className="h-8 w-8" />,
    color: 'bg-green-500',
    questionCount: 0
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'Quiz yourself on S3, EBS, and storage solutions',
    icon: <HardDrive className="h-8 w-8" />,
    color: 'bg-purple-500',
    questionCount: 0
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Test your IAM, Security Groups, and best practices knowledge',
    icon: <Shield className="h-8 w-8" />,
    color: 'bg-red-500',
    questionCount: 0
  },
  {
    id: 'database',
    name: 'Database',
    description: 'Challenge yourself with RDS, DynamoDB, and data management',
    icon: <Database className="h-8 w-8" />,
    color: 'bg-yellow-500',
    questionCount: 0
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    description: 'Test your CloudWatch, logging, and observability knowledge',
    icon: <Monitor className="h-8 w-8" />,
    color: 'bg-indigo-500',
    questionCount: 0
  },
  {
    id: 'serverless',
    name: 'Serverless',
    description: 'Quiz yourself on Lambda, ECS, and container services',
    icon: <Server className="h-8 w-8" />,
    color: 'bg-indigo-500',
    questionCount: 0
  },
  {
    id: 'general',
    name: 'General',
    description: 'Test your general AWS concepts and best practices knowledge',
    icon: <BookOpen className="h-8 w-8" />,
    color: 'bg-gray-500',
    questionCount: 0
  }
];

export default function QuizletPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [topicsWithCounts, setTopicsWithCounts] = useState<Topic[]>(topics);

  // Fetch question counts for topics
  useEffect(() => {
    async function fetchQuestionCounts() {
      try {
        const response = await fetch('/api/quiz');
        const result = await response.json();
        
        if (result.success && result.data) {
          const questions = result.data;
          const updatedTopics = topics.map(topic => ({
            ...topic,
            questionCount: questions.filter((question: QuizQuestion) => question.category === topic.id).length
          }));
          setTopicsWithCounts(updatedTopics);
        }
      } catch (err) {
        console.error('Error fetching question counts:', err);
      }
    }

    fetchQuestionCounts();
  }, []);

  const selectTopic = async (topicId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/quiz?category=${topicId}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setQuizQuestions(result.data);
        setTotalQuestions(result.data.length);
        setSelectedTopic(topicId);
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

  const goBackToTopics = () => {
    setSelectedTopic(null);
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setTotalQuestions(0);
    setError(null);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(answerIndex);
      if (answerIndex === quizQuestions[currentQuestionIndex].correctAnswer) {
        setScore(score + 1);
      }
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

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];

  // Topic Selection Screen
  if (!selectedTopic) {
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
                  <p className="text-sm text-gray-600">Choose a topic to start testing your knowledge</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Quiz Topic
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select a topic below to start testing your AWS knowledge with interactive quizzes. 
              Each topic contains relevant questions about AWS concepts and services.
            </p>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topicsWithCounts.map((topic) => (
              <motion.div
                key={topic.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => selectTopic(topic.id)}
              >
                <div className="flex items-center mb-4">
                  <div className={`${topic.color} p-3 rounded-lg mr-4 text-white`}>
                    {topic.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{topic.name}</h3>
                    <p className="text-sm text-gray-500">{topic.questionCount} questions</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{topic.description}</p>
                <div className="mt-4 flex items-center text-aws-orange text-sm font-medium">
                  Start Quiz
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">☁️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Quiz</h1>
          <p className="text-gray-600">Fetching questions from AWS DynamoDB...</p>
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
          <button onClick={goBackToTopics} className="aws-button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  // No questions available
  if (quizQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Questions Available</h1>
          <p className="text-gray-600 mb-4">This topic doesn't have any quiz questions yet.</p>
          <button onClick={goBackToTopics} className="aws-button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  // Quiz Complete Screen
  if (currentQuestionIndex >= quizQuestions.length) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const isPassing = percentage >= 70;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className={`text-6xl mb-4 ${isPassing ? 'text-green-500' : 'text-orange-500'}`}>
              {isPassing ? '🎉' : '📚'}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isPassing ? 'Congratulations!' : 'Good Effort!'}
            </h1>
            <p className="text-gray-600 mb-6">
              {isPassing 
                ? 'You passed the quiz! Keep up the great work.' 
                : 'Keep studying and try again to improve your score.'
              }
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {score}/{totalQuestions}
              </div>
              <div className="text-lg text-gray-600 mb-2">
                {percentage}% Score
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${isPassing ? 'bg-green-500' : 'bg-orange-500'}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={restartQuiz}
                className="w-full bg-aws-orange text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </button>
              <button
                onClick={goBackToTopics}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Choose Different Topic
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Question Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button onClick={goBackToTopics} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AWS Quiz</h1>
                <p className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Trophy className="h-4 w-4 mr-1" />
                Score: {score}/{totalQuestions}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === null
                      ? 'border-gray-200 hover:border-aws-orange hover:bg-orange-50'
                      : selectedAnswer === index
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswer === null
                        ? 'border-gray-300'
                        : selectedAnswer === index
                        ? index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-500'
                          : 'border-red-500 bg-red-500'
                        : index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer !== null && (
                        index === currentQuestion.correctAnswer ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : selectedAnswer === index ? (
                          <XCircle className="h-4 w-4 text-white" />
                        ) : null
                      )}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Explanation */}
            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8"
              >
                <h3 className="font-semibold text-blue-900 mb-2">Explanation</h3>
                <p className="text-blue-800">{currentQuestion.explanation}</p>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>

              <button
                onClick={nextQuestion}
                disabled={currentQuestionIndex >= quizQuestions.length - 1}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  currentQuestionIndex >= quizQuestions.length - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-aws-orange text-white hover:bg-orange-600'
                }`}
              >
                {currentQuestionIndex >= quizQuestions.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 