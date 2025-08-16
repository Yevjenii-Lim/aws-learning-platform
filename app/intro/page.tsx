'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Cloud, 
  BookOpen, 
  Target, 
  Users, 
  Zap, 
  Shield, 
  Globe,
  ChevronRight,
  Play,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';

export default function IntroPage() {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      id: 0,
      title: "What is AWS?",
      icon: Cloud,
      content: {
        description: "Amazon Web Services (AWS) is the world's most comprehensive and broadly adopted cloud platform, offering over 200 fully featured services from data centers globally.",
        features: [
          "Scalable cloud computing services",
          "Pay-as-you-go pricing model",
          "Global infrastructure",
          "Enterprise-grade security",
          "Wide range of services"
        ]
      }
    },
    {
      id: 1,
      title: "What can you do with AWS?",
      icon: Zap,
      content: {
        description: "AWS enables you to build sophisticated applications with increased flexibility, scalability, and reliability.",
        features: [
          "Host websites and web applications",
          "Store and process data",
          "Run machine learning models",
          "Build mobile applications",
          "Create IoT solutions",
          "Deploy serverless applications"
        ]
      }
    },
    {
      id: 2,
      title: "About This Learning Platform",
      icon: BookOpen,
      content: {
        description: "Our interactive platform helps you learn AWS through hands-on tutorials, visual guides, and practical examples.",
        features: [
          "Step-by-step tutorials with console and CLI instructions",
          "Interactive architecture builder",
          "Visual learning with diagrams and examples",
          "Progress tracking",
          "Real-world scenarios"
        ]
      }
    },
    {
      id: 3,
      title: "How to Get Started",
      icon: Target,
      content: {
        description: "Follow this learning path to build your AWS expertise from the ground up.",
        features: [
          "Start with VPC (Virtual Private Cloud) - Networking foundation",
          "Learn EC2 (Elastic Compute Cloud) - Virtual servers",
          "Explore S3 (Simple Storage Service) - Object storage",
          "Master RDS (Relational Database Service) - Managed databases",
          "Use the Architecture Builder to visualize concepts"
        ]
      }
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Team Learning",
      description: "Perfect for teams learning AWS together"
    },
    {
      icon: Shield,
      title: "Hands-on Practice",
      description: "Learn by doing with real AWS services"
    },
    {
      icon: Globe,
      title: "Visual Learning",
      description: "See concepts come to life with interactive diagrams"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Platform
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Welcome to AWS Learning</h1>
              <p className="text-sm text-gray-600">Your journey to AWS mastery starts here</p>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="text-6xl mb-4">☁️</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Master AWS Cloud Computing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn Amazon Web Services through interactive tutorials, visual guides, and hands-on practice. 
              Build your cloud expertise step by step.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center space-x-4"
          >
            <Link
              href="/tutorial/vpc/create-vpc"
              className="aws-button flex items-center px-6 py-3 text-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Learning
            </Link>
            <Link
              href="/constructor"
              className="aws-button-secondary flex items-center px-6 py-3 text-lg"
            >
              <Globe className="h-5 w-5 mr-2" />
              Try Architecture Builder
            </Link>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(index)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === index
                      ? 'bg-aws-orange text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {section.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {(() => {
                const section = sections[activeSection];
                const Icon = section.icon;
                
                return (
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-aws-orange rounded-lg flex items-center justify-center text-white mr-4">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{section.title}</h3>
                    </div>
                    
                    <p className="text-lg text-gray-700 mb-6">
                      {section.content.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.content.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6 text-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Learning Path */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Learning Path</h3>
          
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Networking Foundation",
                description: "Learn VPC (Virtual Private Cloud) - the foundation of AWS networking",
                service: "VPC",
                tutorial: "Create Your First VPC",
                color: "bg-blue-500"
              },
              {
                step: 2,
                title: "Compute Services",
                description: "Master EC2 (Elastic Compute Cloud) - virtual servers in the cloud",
                service: "EC2",
                tutorial: "Launch Your First EC2 Instance",
                color: "bg-green-500"
              },
              {
                step: 3,
                title: "Storage Solutions",
                description: "Explore S3 (Simple Storage Service) - object storage for any data",
                service: "S3",
                tutorial: "Create and Configure S3 Bucket",
                color: "bg-orange-500"
              },
              {
                step: 4,
                title: "Database Services",
                description: "Learn RDS (Relational Database Service) - managed databases",
                service: "RDS",
                tutorial: "Create RDS Database Instance",
                color: "bg-purple-500"
              }
            ].map((path, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center space-x-4"
              >
                <div className={`w-8 h-8 ${path.color} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                  {path.step}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{path.title}</h4>
                  <p className="text-gray-600 text-sm">{path.description}</p>
                </div>
                <Link
                  href={`/tutorial/${path.service.toLowerCase()}/${path.tutorial.toLowerCase().replace(/\s+/g, '-')}`}
                  className="aws-button-secondary flex items-center px-4 py-2 text-sm"
                >
                  Start
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your AWS Journey?</h3>
            <p className="text-gray-600 mb-6">Choose your starting point and begin building your cloud expertise today.</p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/tutorial/vpc/create-vpc"
                className="aws-button flex items-center px-8 py-3 text-lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Start with VPC Tutorial
              </Link>
              <Link
                href="/games"
                className="aws-button-secondary flex items-center px-8 py-3 text-lg"
              >
                <Globe className="h-5 w-5 mr-2" />
                Explore Learning Games
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 