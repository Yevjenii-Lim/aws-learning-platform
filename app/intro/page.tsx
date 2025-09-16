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
  CheckCircle,
  HelpCircle,
  Search,
  BarChart3,
  LogIn,
  Settings,
  Calculator,
  MessageSquare,
  Gamepad2,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import ClientOnly from '../components/ClientOnly';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function IntroPage() {
  const [activeSection, setActiveSection] = useState(0);
  const { user } = useAuth();



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


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header
        title="Welcome to AWS Learning"
        subtitle="Your journey to AWS mastery starts here"
        showBackButton={true}
        backUrl="/"
        showGamesButton={false}
      />

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


        </div>

        {/* Who is This For? Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Who is This For?</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Primary Users */}
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-6 w-6 mr-2 text-aws-orange" />
                Primary Users
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-aws-orange rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h5 className="font-medium text-gray-900">AWS Beginners</h5>
                    <p className="text-sm text-gray-600">New to cloud computing and looking for a clear starting point</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-aws-orange rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h5 className="font-medium text-gray-900">Students</h5>
                    <p className="text-sm text-gray-600">Bootcamp participants and those preparing for cloud careers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-aws-orange rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h5 className="font-medium text-gray-900">Career Changers</h5>
                    <p className="text-sm text-gray-600">Professionals transitioning into tech and cloud roles</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-aws-orange rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h5 className="font-medium text-gray-900">Aspiring Cloud Professionals</h5>
                    <p className="text-sm text-gray-600">Building foundational AWS knowledge</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Users */}
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-6 w-6 mr-2 text-aws-orange" />
                Secondary Users
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-aws-orange rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h5 className="font-medium text-gray-900">Educators & Trainers</h5>
                    <p className="text-sm text-gray-600">Teaching cloud concepts to students</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-aws-orange rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h5 className="font-medium text-gray-900">Certification Candidates</h5>
                    <p className="text-sm text-gray-600">Preparing for AWS certification exams</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-aws-orange rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h5 className="font-medium text-gray-900">Organizations</h5>
                    <p className="text-sm text-gray-600">Training staff on cloud technologies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Getting Started</h3>
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-start space-x-4"
            >
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                1
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Create Your Account</h4>
                <p className="text-gray-600">Sign up with your username and password</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-start space-x-4"
            >
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                2
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Explore the Service Cards</h4>
                <p className="text-gray-600">Start with our Service Explorer where the 7 core AWS services are presented as interactive cards. Click any card to flip it and see a simple explanation with analogies.</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-start space-x-4"
            >
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                3
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Begin Your Learning Journey</h4>
                <p className="text-gray-600">Choose a service that interests you and start its learning module. Each module follows our proven 4-part structure for maximum understanding.</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-start space-x-4"
            >
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                4
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Track Your Progress</h4>
                <p className="text-gray-600">Watch your dashboard fill up as you complete modules, earn points, and unlock badges. Celebrate each milestone in your cloud learning journey.</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-start space-x-4"
            >
              <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                5
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Practice with Real-World Tools</h4>
                <p className="text-gray-600">Use our cost calculator to estimate expenses for different AWS configurations, building practical skills you'll use in the real world.</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Links */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center space-x-4"
          >
            <Link
              href="/tutorial/topic-1757958990253/tutorial-1757958998747"
              className="aws-button flex items-center px-6 py-3 text-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Create Free AWS Account
            </Link>
            <Link
              href="/games"
              className="aws-button-secondary flex items-center px-6 py-3 text-lg"
            >
              <Gamepad2 className="h-5 w-5 mr-2" />
              Try Games
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
        

        {/* Navigation Tips */}
        <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Navigation Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Start Simple</h4>
              <p className="text-gray-600">Begin with fundamental services like S3 or EC2 if you're completely new</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Overview</h4>
              <p className="text-gray-600">Your progress wheel shows overall completion at a glance</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Service Cards</h4>
              <p className="text-gray-600">Each service card flips to reveal key information and learning objectives</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Quiz Feedback</h4>
              <p className="text-gray-600">Get immediate results and explanations for all quiz questions</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-6 w-6 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Cost Calculator</h4>
              <p className="text-gray-600">Practice with different scenarios to build financial estimation skills</p>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 