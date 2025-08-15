'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Clock, Target, ChevronRight, Plus } from 'lucide-react';
import { awsServices, AWSService, AWSTutorial } from '../data/aws-services';
import Link from 'next/link';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'networking', 'compute', 'storage', 'database'];

  const filteredServices = awsServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           service.tutorials.some(tutorial => 
                             tutorial.category.toLowerCase() === selectedCategory
                           );
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">☁️</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AWS Learning Platform</h1>
                <p className="text-gray-600">Master AWS with interactive visualizations</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/constructor"
                className="aws-button flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Architecture Builder
              </Link>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search services or tutorials..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aws-orange focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h2 
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Learn AWS Step by Step
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Visualize AWS operations with detailed console and CLI instructions. 
            Follow along and build your cloud expertise with hands-on tutorials.
          </motion.p>
        </div>

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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              className="aws-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center text-2xl mr-4`}>
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                {service.tutorials.map((tutorial) => (
                  <Link
                    key={tutorial.id}
                    href={`/tutorial/${service.id}/${tutorial.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-aws-orange hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">{tutorial.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{tutorial.description}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {tutorial.estimatedTime}
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {tutorial.steps.length} steps
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                            {tutorial.difficulty}
                          </span>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center text-aws-orange font-medium text-sm">
                            Start Tutorial
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-aws-orange mb-2">
                {awsServices.length}
              </div>
              <div className="text-gray-600">AWS Services</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-aws-orange mb-2">
                {awsServices.reduce((acc, service) => acc + service.tutorials.length, 0)}
              </div>
              <div className="text-gray-600">Tutorials</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-aws-orange mb-2">
                {awsServices.reduce((acc, service) => 
                  acc + service.tutorials.reduce((sum, tutorial) => sum + tutorial.steps.length, 0), 0
                )}
              </div>
              <div className="text-gray-600">Total Steps</div>
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