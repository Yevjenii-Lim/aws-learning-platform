'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Circle, 
  Monitor, 
  Lightbulb,
  Clock,
  Target,
  BookOpen,
  ArrowLeft,
  Terminal,
  Copy,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
// Types for AWS data
interface AWSService {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tutorials: AWSTutorial[];
}

interface AWSTutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  category: string;
  steps: any[];
  learningObjectives: string[];
}
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TutorialPageProps {
  params: {
    serviceId: string;
    tutorialId: string;
  };
}

export default function TutorialPage({ params }: TutorialPageProps) {
  const { user } = useAuth();
  const [service, setService] = useState<AWSService | null>(null);
  const [tutorial, setTutorial] = useState<AWSTutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'console' | 'cli'>('console');
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    async function fetchTutorial() {
      try {
        setLoading(true);
        
        // Fetch all topics to get the topic and tutorial data
        const response = await fetch('/api/topics');
        const result = await response.json();
        
        if (result.success && result.data) {
          // Find the topic (using serviceId as topicId)
          const topicInfo = result.data.find((t: any) => t.id === params.serviceId);
          
          if (topicInfo) {
            // Create service object (using topic data)
            const serviceData: AWSService = {
              id: topicInfo.id,
              name: topicInfo.name,
              description: topicInfo.description,
              icon: topicInfo.icon,
              color: topicInfo.color,
              tutorials: topicInfo.tutorials || []
            };
            setService(serviceData);
            
            // Find the specific tutorial within the topic
            const tutorialInfo = topicInfo.tutorials?.find((t: any) => t.id === params.tutorialId);
            
            if (tutorialInfo) {
              const tutorialData: AWSTutorial = {
                id: tutorialInfo.id,
                title: tutorialInfo.title,
                description: tutorialInfo.description,
                difficulty: tutorialInfo.difficulty,
                estimatedTime: tutorialInfo.estimatedTime,
                category: tutorialInfo.category,
                steps: tutorialInfo.steps || [],
                learningObjectives: tutorialInfo.learningObjectives || []
              };
              setTutorial(tutorialData);
            } else {
              setError('Tutorial not found');
            }
          } else {
            setError('Topic not found');
          }
        } else {
          setError('Failed to fetch tutorial data');
        }
      } catch (error) {
        console.error('Error fetching tutorial:', error);
        setError('Failed to fetch tutorial data');
      } finally {
        setLoading(false);
      }
    }

    fetchTutorial();
  }, [params.serviceId, params.tutorialId]);

  const copyToClipboard = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(command);
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
    }
  };

  const markAsCompleted = async () => {
    if (!user || !tutorial) return;
    
    try {
      setIsCompleting(true);
      
      const response = await fetch('/api/users/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'complete_tutorial',
          data: {
            tutorialId: tutorial.id,
            tutorialTitle: tutorial.title,
            serviceId: params.serviceId,
            serviceName: service?.name,
            estimatedTime: tutorial.estimatedTime
          }
        }),
      });

      if (response.ok) {
        setIsCompleted(true);
        // Show success message for 3 seconds
        setTimeout(() => setIsCompleted(false), 3000);
      } else {
        console.error('Failed to mark tutorial as completed');
      }
    } catch (error) {
      console.error('Error marking tutorial as completed:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aws-orange mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tutorial...</p>
        </div>
      </div>
    );
  }

  if (error || !service || !tutorial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tutorial Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The tutorial you\'re looking for doesn\'t exist.'}</p>
          <Link href="/" className="aws-button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{tutorial.title}</h1>
                <p className="text-sm text-gray-600">{service.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {tutorial.estimatedTime}
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {tutorial.steps.length} steps
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Tutorial Overview</h3>
              
              {/* Tutorial Info */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {tutorial.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <Target className="h-4 w-4 mr-2 mt-0.5 text-aws-orange flex-shrink-0" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps Overview */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Steps Overview</h4>
                <div className="space-y-2">
                  {tutorial.steps.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-aws-orange text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-700">{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Tutorial Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">{tutorial.title}</h2>
                  <p className="text-gray-600">{tutorial.description}</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('console')}
                    className={`flex items-center px-3 py-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'console'
                        ? 'border-aws-orange text-aws-orange'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    Console Instructions
                  </button>
                  <button
                    onClick={() => setActiveTab('cli')}
                    className={`flex items-center px-3 py-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'cli'
                        ? 'border-aws-orange text-aws-orange'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Terminal className="h-4 w-4 mr-2" />
                    CLI Commands
                  </button>
                </div>
              </div>

              {/* Tutorial Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'console' ? (
                    <motion.div
                      key="console"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      {/* Console Instructions for all steps */}
                      {tutorial.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-aws-orange text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                              {stepIndex + 1}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                              <p className="text-gray-600">{step.description}</p>
                            </div>
                          </div>
                          
                          <div className="ml-12">
                            <h4 className="font-semibold text-gray-900 flex items-center mb-3">
                              <Monitor className="h-5 w-5 mr-2 text-aws-orange" />
                              Console Instructions
                            </h4>
                            <ol className="space-y-3">
                              {step.consoleInstructions.map((instruction: any, index: number) => (
                                <li key={index} className="flex items-start">
                                  <span className="flex-shrink-0 w-6 h-6 bg-aws-orange text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                                    {index + 1}
                                  </span>
                                  <span className="text-gray-700">{instruction}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="cli"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      {/* CLI Commands for all steps */}
                      {tutorial.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-aws-orange text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                              {stepIndex + 1}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                              <p className="text-gray-600">{step.description}</p>
                            </div>
                          </div>
                          
                          <div className="ml-12">
                            <h4 className="font-semibold text-gray-900 flex items-center mb-3">
                              <Terminal className="h-5 w-5 mr-2 text-aws-orange" />
                              CLI Commands
                            </h4>
                            
                            {step.cliCommands && step.cliCommands.length > 0 ? (
                              <div className="space-y-4">
                                {step.cliCommands.map((command: string, index: number) => (
                                  <div key={index} className="bg-gray-900 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm text-gray-400">Command {index + 1}</span>
                                      <button
                                        onClick={() => copyToClipboard(command)}
                                        className="flex items-center text-gray-400 hover:text-white transition-colors"
                                      >
                                        {copiedCommand === command ? (
                                          <CheckCircle2 className="h-4 w-4 mr-1" />
                                        ) : (
                                          <Copy className="h-4 w-4 mr-1" />
                                        )}
                                        {copiedCommand === command ? 'Copied!' : 'Copy'}
                                      </button>
                                    </div>
                                    <SyntaxHighlighter
                                      language="bash"
                                      style={tomorrow}
                                      customStyle={{
                                        margin: 0,
                                        background: 'transparent',
                                        fontSize: '14px',
                                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                      }}
                                    >
                                      {command}
                                    </SyntaxHighlighter>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-gray-500">
                                <Terminal className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                <p>No CLI commands available for this step.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tips Section */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <Lightbulb className="h-6 w-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-3">Pro Tips</h4>
                      <div className="space-y-4">
                        {tutorial.steps.map((step, stepIndex) => (
                          step.tips && step.tips.length > 0 && (
                            <div key={stepIndex} className="border-l-4 border-blue-300 pl-4">
                              <h5 className="font-medium text-blue-800 mb-2">Step {stepIndex + 1}: {step.title}</h5>
                              <ul className="space-y-1 text-sm text-blue-800">
                                {step.tips.map((tip: any, index: number) => (
                                  <li key={index}>• {tip}</li>
                                ))}
                              </ul>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mark as Completed Section - Only visible when user is logged in */}
                {user && (
                  <div className="mt-8 border-t border-gray-200 pt-8">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Congratulations! 🎉
                      </h3>
                      <p className="text-gray-600 mb-6">
                        You've completed this tutorial. Mark it as completed to track your progress and earn achievements.
                      </p>
                      
                      {isCompleted ? (
                        <div className="inline-flex items-center px-6 py-3 bg-green-100 border border-green-300 rounded-lg text-green-800">
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                          Tutorial completed successfully!
                        </div>
                      ) : (
                        <button
                          onClick={markAsCompleted}
                          disabled={isCompleting}
                          className="inline-flex items-center px-6 py-3 bg-aws-orange hover:bg-aws-orange-dark disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                          {isCompleting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Marking as completed...
                            </>
                          ) : (
                            <>
                              <Trophy className="h-5 w-5 mr-2" />
                              Mark as Completed
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 