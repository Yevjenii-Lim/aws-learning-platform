'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Puzzle, 
  CreditCard, 
  Brain, 
  Plus, 
  BookOpen, 
  Target,
  Zap,
  Trophy
} from 'lucide-react';
import Link from 'next/link';
import ClientOnly from '../components/ClientOnly';

interface GameCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href: string;
  estimatedTime: string;
  features: string[];
}

const games: GameCard[] = [
  {
    id: 'architecture-builder',
    title: 'Architecture Builder DEMO',
    description: 'Drag and drop AWS components to build and visualize cloud architectures',
    icon: <Plus className="h-8 w-8" />,
    color: 'bg-blue-500',
    href: '/games/architecture-builder',
    estimatedTime: '15-30 minutes',
    features: ['Drag & Drop Components', 'Visual Connections', 'Pre-built Templates', 'Real-time Validation']
  },
  {
    id: 'flashcards',
    title: 'AWS Flashcards',
    description: 'Learn AWS concepts and services with interactive flashcards',
    icon: <CreditCard className="h-8 w-8" />,
    color: 'bg-green-500',
    href: '/games/flashcards',
    estimatedTime: '10-20 minutes',
    features: ['Service Definitions', 'Key Concepts', 'Best Practices', 'Progress Tracking']
  },
  {
    id: 'quizlet',
    title: 'AWS Quiz',
    description: 'Test your AWS knowledge with interactive quizzes and assessments',
    icon: <Brain className="h-8 w-8" />,
    color: 'bg-purple-500',
    href: '/games/quizlet',
    estimatedTime: '20-40 minutes',
    features: ['Multiple Choice Questions', 'Scenario-based Problems', 'Score Tracking', 'Detailed Explanations']
  }
];

export default function GamesPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">🎮</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AWS Learning Games</h1>
                <p className="text-gray-600">Learn AWS through interactive games and activities</p>
              </div>
            </div>
            <Link
              href="/"
              className="aws-button flex items-center"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Back to Lessons
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <ClientOnly>
            <motion.h2
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Learn AWS Through Games
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Master AWS concepts with interactive games, flashcards, and quizzes. 
              Build architectures, test your knowledge, and track your progress.
            </motion.p>
          </ClientOnly>
        </div>



        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {games.map((game, index) => (
            <ClientOnly key={game.id}>
              <motion.div
                className="aws-card hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={game.href} className="block">
                  <div className="flex items-center mb-4">
                    <div className={`w-16 h-16 rounded-lg ${game.color} flex items-center justify-center text-white mr-4`}>
                      {game.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{game.title}</h3>
                      <p className="text-sm text-gray-600">{game.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Target className="h-4 w-4 mr-1" />
                      {game.estimatedTime}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 text-sm">Features:</h4>
                      <ul className="space-y-1">
                        {game.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-xs text-gray-600">
                            <Zap className="h-3 w-3 mr-2 text-aws-orange" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-aws-orange font-medium text-sm">
                        Start Game
                        <Trophy className="h-4 w-4 ml-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </ClientOnly>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-aws-orange mb-2">
                {games.length}
              </div>
              <div className="text-gray-600">Learning Games</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-aws-orange mb-2">
                {games.reduce((acc, game) => acc + game.features.length, 0)}
              </div>
              <div className="text-gray-600">Interactive Features</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-aws-orange mb-2">24/7</div>
              <div className="text-gray-600">Available</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 