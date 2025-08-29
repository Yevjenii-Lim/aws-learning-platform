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
  ArrowLeft,
  Copy,
  ExternalLink,
  Image,
  X,
  ZoomIn
} from 'lucide-react';
import { AWSService, AWSTutorial, AWSStep } from '../../../../../lib/dynamodb';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ClientOnly from '../../../../components/ClientOnly';
import Comments from '../../../../components/Comments';

interface CLIPageProps {
  params: {
    serviceId: string;
    tutorialId: string;
  };
}

export default function CLIPage({ params }: CLIPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [service, setService] = useState<AWSService | null>(null);
  const [tutorial, setTutorial] = useState<AWSTutorial | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorialData = async () => {
      try {
        // Fetch service data
        const serviceResponse = await fetch(`/api/services/${params.serviceId}`);
        const serviceData = await serviceResponse.json();
        if (serviceData.success) {
          setService(serviceData.data);
        }

        // Fetch tutorial data
        const tutorialResponse = await fetch(`/api/services/${params.serviceId}/tutorials/${params.tutorialId}`);
        const tutorialData = await tutorialResponse.json();
        if (tutorialData.success) {
          setTutorial(tutorialData.data);
        }
      } catch (error) {
        console.error('Error fetching tutorial data:', error);
      }
    };

    fetchTutorialData();
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

  const copyToClipboard = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(command);
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href={`/tutorial/${params.serviceId}/${params.tutorialId}`} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">CLI Commands - {tutorial.title}</h1>
                <p className="text-sm text-gray-600">{service.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Terminal className="h-4 w-4 mr-1" />
                CLI Mode
              </div>
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
              <h3 className="font-semibold text-gray-900 mb-4">CLI Progress</h3>
              
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

              {/* CLI Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">CLI Prerequisites</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <Terminal className="h-4 w-4 mr-2 mt-0.5 text-aws-orange flex-shrink-0" />
                    AWS CLI installed and configured
                  </li>
                  <li className="flex items-start">
                    <Target className="h-4 w-4 mr-2 mt-0.5 text-aws-orange flex-shrink-0" />
                    Proper AWS credentials set up
                  </li>
                  <li className="flex items-start">
                    <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-aws-orange flex-shrink-0" />
                    Basic terminal knowledge
                  </li>
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

                {/* CLI Commands Content */}
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Terminal className="h-5 w-5 mr-2 text-aws-orange" />
                      CLI Commands
                    </h3>
                    
                    <div className="space-y-4">
                      {currentStepData.cliCommands.map((command: string, index: number) => (
                        <div key={index} className="bg-gray-900 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Command {index + 1}</span>
                            <ClientOnly>
                              <button
                                onClick={() => copyToClipboard(command)}
                                className="flex items-center text-gray-400 hover:text-white transition-colors"
                              >
                                {copiedCommand === command ? (
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                ) : (
                                  <Copy className="h-4 w-4 mr-1" />
                                )}
                                {copiedCommand === command ? 'Copied!' : 'Copy'}
                              </button>
                            </ClientOnly>
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
                  </div>

                  {/* Screenshot Display */}
                  {currentStepData.screenshot && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Image className="h-5 w-5 mr-2 text-aws-orange" />
                        Visual Reference
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="relative group cursor-pointer" onClick={() => setSelectedImage(currentStepData.screenshot)}>
                          <img
                            src={currentStepData.screenshot}
                            alt={`Screenshot for step ${currentStep + 1}`}
                            className="w-full max-w-2xl h-auto rounded-lg border border-gray-200 shadow-sm transition-transform duration-200 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Command Explanation */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <Lightbulb className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-2">Command Explanation</h4>
                        <p className="text-sm text-blue-800 mb-2">
                          These CLI commands perform the same actions as the console instructions but through the command line interface.
                        </p>
                        <ul className="space-y-1 text-sm text-blue-800">
                          {currentStepData.tips.map((tip: string, index: number) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Console Alternative */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Monitor className="h-5 w-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Prefer Console?</h4>
                        <p className="text-sm text-gray-700 mb-3">
                          If you prefer using the AWS Management Console instead of CLI commands, you can switch to the console view.
                        </p>
                        <Link
                          href={`/tutorial/${params.serviceId}/${params.tutorialId}`}
                          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Monitor className="h-4 w-4 mr-2" />
                          Switch to Console View
                        </Link>
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

      {/* Comments Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Empty sidebar to maintain layout */}
          <div className="lg:col-span-1"></div>
          
          {/* Comments in main content area */}
          <div className="lg:col-span-3">
            <Comments tutorialId={params.tutorialId} />
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              
              {/* Image */}
              <img
                src={selectedImage}
                alt="Screenshot"
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 