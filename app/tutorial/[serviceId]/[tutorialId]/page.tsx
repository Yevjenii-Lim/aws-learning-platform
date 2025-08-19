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
  ArrowLeft
} from 'lucide-react';
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
  const [currentStep, setCurrentStep] = useState(0);
  const [service, setService] = useState<AWSService | null>(null);
  const [tutorial, setTutorial] = useState<AWSTutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        console.error('Error fetching tutorial:', err);
        setError('Failed to load tutorial');
      } finally {
        setLoading(false);
      }
    }

    fetchTutorial();
  }, [params.serviceId, params.tutorialId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">☁️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Tutorial</h1>
          <p className="text-gray-600">Fetching tutorial from AWS DynamoDB...</p>
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

  const currentStepData = tutorial.steps[currentStep];

  const nextStep = () => {
    if (currentStep < tutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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
          {/* Sidebar - Steps */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Steps</h3>
              
              {/* Steps List */}
              <div className="space-y-3">
                {tutorial.steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentStep
                        ? 'bg-aws-orange text-white'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="step-indicator">
                        <span className="text-gray-700">{index + 1}</span>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700">{step.title}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Tutorial Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
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
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm"
              >
                {/* Step Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="step-indicator">
                      <span className="text-lg">{currentStep + 1}</span>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-semibold text-gray-900">{currentStepData.title}</h2>
                      <p className="text-gray-600">{currentStepData.description}</p>
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="p-6">
                  {/* Console Instructions */}
                  <div className="mb-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <Monitor className="h-5 w-5 mr-2 text-aws-orange" />
                        Console Instructions
                      </h3>
                    </div>
                    <ol className="space-y-3">
                      {currentStepData.consoleInstructions.map((instruction: any, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 bg-aws-orange text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Tips */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Lightbulb className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-2">Pro Tips</h4>
                        <ul className="space-y-1 text-sm text-blue-800">
                          {currentStepData.tips.map((tip: any, index: number) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentStep === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={currentStep === tutorial.steps.length - 1}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentStep === tutorial.steps.length - 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-aws-orange text-white hover:bg-orange-600'
                      }`}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
} 