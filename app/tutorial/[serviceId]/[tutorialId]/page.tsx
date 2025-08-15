'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Circle, 
  Terminal, 
  Monitor, 
  Lightbulb,
  Clock,
  Target,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { awsServices, AWSService, AWSTutorial, AWSStep } from '../../../../data/aws-services';
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
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showCLI, setShowCLI] = useState(false);
  const [service, setService] = useState<AWSService | null>(null);
  const [tutorial, setTutorial] = useState<AWSTutorial | null>(null);

  useEffect(() => {
    const foundService = awsServices.find(s => s.id === params.serviceId);
    if (foundService) {
      setService(foundService);
      const foundTutorial = foundService.tutorials.find(t => t.id === params.tutorialId);
      if (foundTutorial) {
        setTutorial(foundTutorial);
      }
    }
  }, [params.serviceId, params.tutorialId]);

  if (!service || !tutorial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tutorial Not Found</h1>
          <p className="text-gray-600 mb-4">The tutorial you're looking for doesn't exist.</p>
          <Link href="/" className="aws-button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentStepData = tutorial.steps[currentStep];
  const progress = (completedSteps.length / tutorial.steps.length) * 100;

  const markStepComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

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

  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.includes(stepIndex)) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
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
          {/* Sidebar - Progress */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Progress</h3>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{completedSteps.length} of {tutorial.steps.length} completed</span>
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

              {/* Steps List */}
              <div className="space-y-3">
                {tutorial.steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentStep
                        ? 'bg-aws-orange text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`step-indicator ${
                        getStepStatus(index) === 'completed' ? 'step-completed' :
                        getStepStatus(index) === 'active' ? 'step-active' : 'step-pending'
                      }`}>
                        {getStepStatus(index) === 'completed' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <span className="ml-3 text-sm font-medium">{step.title}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Tutorial Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-sm text-gray-600">
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
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`step-indicator ${
                        getStepStatus(currentStep) === 'completed' ? 'step-completed' : 'step-active'
                      }`}>
                        {getStepStatus(currentStep) === 'completed' ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span className="text-lg">{currentStep + 1}</span>
                        )}
                      </div>
                      <div className="ml-4">
                        <h2 className="text-xl font-semibold text-gray-900">{currentStepData.title}</h2>
                        <p className="text-gray-600">{currentStepData.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={markStepComplete}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        completedSteps.includes(currentStep)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-aws-orange text-white hover:bg-orange-600'
                      }`}
                    >
                      {completedSteps.includes(currentStep) ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                </div>

                {/* Step Content */}
                <div className="p-6">
                  {/* Instructions Toggle */}
                  <div className="flex space-x-2 mb-6">
                    <button
                      onClick={() => setShowCLI(false)}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        !showCLI ? 'bg-aws-orange text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      Console Instructions
                    </button>
                    <button
                      onClick={() => setShowCLI(true)}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        showCLI ? 'bg-aws-orange text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Terminal className="h-4 w-4 mr-2" />
                      CLI Commands
                    </button>
                  </div>

                  {/* Instructions Content */}
                  <div className="mb-6">
                    {!showCLI ? (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Console Instructions</h3>
                        <ol className="space-y-3">
                          {currentStepData.consoleInstructions.map((instruction, index) => (
                            <li key={index} className="flex items-start">
                              <span className="flex-shrink-0 w-6 h-6 bg-aws-orange text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                                {index + 1}
                              </span>
                              <span className="text-gray-700">{instruction}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">CLI Commands</h3>
                        <div className="space-y-3">
                          {currentStepData.cliCommands.map((command, index) => (
                            <div key={index} className="bg-gray-900 rounded-lg p-4">
                              <SyntaxHighlighter
                                language="bash"
                                style={tomorrow}
                                customStyle={{
                                  margin: 0,
                                  background: 'transparent',
                                  fontSize: '14px',
                                }}
                              >
                                {command}
                              </SyntaxHighlighter>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tips */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Lightbulb className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-2">Pro Tips</h4>
                        <ul className="space-y-1 text-sm text-blue-800">
                          {currentStepData.tips.map((tip, index) => (
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