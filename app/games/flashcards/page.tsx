'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Shuffle,
  BookOpen,
  ArrowLeft,
  Cloud,
  Server,
  Database,
  Shield,
  Monitor,
  HardDrive,
  Trophy
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  tags: string[];
}

interface Topic {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  cardCount: number;
}

const topics: Topic[] = [
  {
    id: 'all',
    name: 'All Flashcards',
    description: 'Practice with all flashcards from all topics',
    icon: <Trophy className="h-8 w-8" />,
    color: 'bg-gradient-to-r from-aws-orange to-orange-600',
    cardCount: 0
  },
  {
    id: 'networking',
    name: 'Networking',
    description: 'Learn about VPC, CloudFront, and network architecture',
    icon: <Cloud className="h-8 w-8" />,
    color: 'bg-blue-500',
    cardCount: 0
  },
  {
    id: 'compute',
    name: 'Compute',
    description: 'Master EC2, Lambda, and serverless computing',
    icon: <Server className="h-8 w-8" />,
    color: 'bg-green-500',
    cardCount: 0
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'Understand S3, EBS, and storage solutions',
    icon: <HardDrive className="h-8 w-8" />,
    color: 'bg-purple-500',
    cardCount: 0
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Learn IAM, Security Groups, and best practices',
    icon: <Shield className="h-8 w-8" />,
    color: 'bg-red-500',
    cardCount: 0
  },
  {
    id: 'database',
    name: 'Database',
    description: 'Master RDS, DynamoDB, and data management',
    icon: <Database className="h-8 w-8" />,
    color: 'bg-yellow-500',
    cardCount: 0
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    description: 'Learn CloudWatch, logging, and observability',
    icon: <Monitor className="h-8 w-8" />,
    color: 'bg-indigo-500',
    cardCount: 0
  },
  {
    id: 'serverless',
    name: 'Serverless',
    description: 'Learn Lambda, ECS, and container services',
    icon: <Server className="h-8 w-8" />,
    color: 'bg-indigo-500',
    cardCount: 0
  },
  {
    id: 'general',
    name: 'General',
    description: 'General AWS concepts and best practices',
    icon: <BookOpen className="h-8 w-8" />,
    color: 'bg-gray-500',
    cardCount: 0
  }
];

export default function FlashcardsPage() {
  const { user } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topicsWithCounts, setTopicsWithCounts] = useState<Topic[]>(topics);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Fetch card counts for topics
  useEffect(() => {
    async function fetchCardCounts() {
      try {
        const response = await fetch('/api/flashcards');
        const result = await response.json();
        
        if (result.success && result.data) {
          const flashcards = result.data;
          const updatedTopics = topics.map(topic => ({
            ...topic,
            cardCount: topic.id === 'all' 
              ? flashcards.length 
              : flashcards.filter((card: Flashcard) => card.category === topic.id).length
          }));
          setTopicsWithCounts(updatedTopics);
        }
      } catch (err) {
        console.error('Error fetching card counts:', err);
      }
    }

    fetchCardCounts();
  }, []);

  const selectTopic = async (topicId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // For "all" category, fetch all flashcards without category filter
      const url = topicId === 'all' 
        ? '/api/flashcards' 
        : `/api/flashcards?category=${topicId}`;
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success && result.data) {
        setShuffledCards(result.data);
        setSelectedTopic(topicId);
        setCurrentCardIndex(0);
        setIsFlipped(false);
      } else {
        setError('Failed to load flashcards');
      }
    } catch (err) {
      console.error('Error fetching flashcards:', err);
      setError('Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };

  const goBackToTopics = () => {
    setSelectedTopic(null);
    setShuffledCards([]);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setError(null);
  };

  const shuffleCards = () => {
    const shuffled = [...shuffledCards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const nextCard = () => {
    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const markAsCompleted = async () => {
    if (!user || !selectedTopic) return;
    
    try {
      setIsCompleting(true);
      
      const topicName = selectedTopic === 'all' 
        ? 'All Flashcards' 
        : topicsWithCounts.find(t => t.id === selectedTopic)?.name || selectedTopic;
      
      const response = await fetch('/api/users/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'complete_flashcards',
          data: {
            topicId: selectedTopic,
            topicName: topicName,
            cardCount: shuffledCards.length
          }
        }),
      });

      if (response.ok) {
        setIsCompleted(true);
        // Show success message for 3 seconds
        setTimeout(() => setIsCompleted(false), 3000);
      } else {
        console.error('Failed to mark flashcards as completed');
      }
    } catch (error) {
      console.error('Error marking flashcards as completed:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  // Topic Selection Screen
  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <Link href="/games" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">AWS Flashcards</h1>
                  <p className="text-sm text-gray-600">Choose a topic to start learning</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Learning Topic
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select a topic below to start practicing with interactive flashcards. 
              Each topic contains relevant AWS concepts and services.
            </p>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topicsWithCounts.map((topic) => (
              <motion.div
                key={topic.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow ${
                  topic.id === 'all' 
                    ? 'bg-gradient-to-r from-aws-orange to-orange-600 text-white border-orange-500' 
                    : 'bg-white border-gray-200'
                }`}
                onClick={() => selectTopic(topic.id)}
              >
                <div className="flex items-center mb-4">
                  <div className={`${topic.color} p-3 rounded-lg mr-4 text-white`}>
                    {topic.icon}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${topic.id === 'all' ? 'text-white' : 'text-gray-900'}`}>
                      {topic.name}
                    </h3>
                    <p className={`text-sm ${topic.id === 'all' ? 'text-orange-100' : 'text-gray-500'}`}>
                      {topic.cardCount} cards
                    </p>
                  </div>
                </div>
                <p className={`text-sm ${topic.id === 'all' ? 'text-orange-100' : 'text-gray-600'}`}>
                  {topic.description}
                </p>
                <div className={`mt-4 flex items-center text-sm font-medium ${
                  topic.id === 'all' ? 'text-white' : 'text-aws-orange'
                }`}>
                  Start Learning
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Flashcards</h1>
          <p className="text-gray-600">Fetching flashcards from AWS DynamoDB...</p>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Flashcards</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={goBackToTopics} className="aws-button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  // Flashcard Screen
  if (shuffledCards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Flashcards Available</h1>
          <p className="text-gray-600 mb-4">This topic doesn't have any flashcards yet.</p>
          <button onClick={goBackToTopics} className="aws-button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  const currentCard = shuffledCards[currentCardIndex];
  const selectedTopicData = topicsWithCounts.find(t => t.id === selectedTopic);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button onClick={goBackToTopics} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {selectedTopicData?.name} Flashcards
                </h1>
                <p className="text-sm text-gray-600">
                  {currentCardIndex + 1} of {shuffledCards.length} cards
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                {/* Removed correct answers count */}
              </div>
              <div className="flex items-center">
                <XCircle className="h-4 w-4 mr-1 text-red-600" />
                {/* Removed incorrect answers count */}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Flashcard */}
        <div className="flex justify-center mb-8">
          <motion.div
            className="w-full max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="relative cursor-pointer perspective-1000"
              onClick={flipCard}
              style={{ height: '256px' }}
            >
              <motion.div
                className="relative w-full h-full"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front of card */}
                <div 
                  className={`absolute inset-0 bg-white rounded-lg shadow-lg p-8 flex items-center justify-center text-center ${
                    isFlipped ? 'backface-hidden' : ''
                  }`}
                  style={{ backfaceVisibility: 'hidden', height: '256px' }}
                >
                  <div className="w-full">
                    <div className="mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {currentCard.category}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentCard.front}</h2>
                    <p className="text-gray-600">Click to reveal answer</p>
                  </div>
                </div>
                
                {/* Back of card */}
                <div 
                  className={`absolute inset-0 bg-white rounded-lg shadow-lg p-8 flex items-center justify-center text-center ${
                    !isFlipped ? 'backface-hidden' : ''
                  }`}
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    height: '256px'
                  }}
                >
                  <div className="w-full">
                    <div className="mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {currentCard.category}
                      </span>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">{currentCard.back}</p>
                    <div className="flex flex-wrap gap-2">
                      {currentCard.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentCardIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </button>
          
          <button
            onClick={nextCard}
            disabled={currentCardIndex === shuffledCards.length - 1}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentCardIndex === shuffledCards.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </button>
        </div>

        {/* Answer Tracking */}
        {/* Removed Answer Tracking section */}

        {/* Shuffle Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={shuffleCards}
            className="flex items-center px-6 py-3 rounded-md text-sm font-medium bg-gray-800 text-white hover:bg-gray-700"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle Cards
          </button>
        </div>

        {/* Mark as Completed Button - Only show when user is logged in and on last card */}
        {user && currentCardIndex === shuffledCards.length - 1 && (
          <div className="flex justify-center">
            {isCompleted ? (
              <div className="flex items-center px-6 py-3 rounded-md text-sm font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-2" />
                Flashcards Completed!
              </div>
            ) : (
              <button
                onClick={markAsCompleted}
                disabled={isCompleting}
                className={`flex items-center px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                  isCompleting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-aws-orange text-white hover:bg-aws-orange-dark'
                }`}
              >
                <Trophy className="h-4 w-4 mr-2" />
                {isCompleting ? 'Marking as Completed...' : 'Mark as Completed'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
