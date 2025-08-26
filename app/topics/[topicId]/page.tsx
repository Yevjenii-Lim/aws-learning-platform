'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Clock, Target, BookOpen, ChevronRight, Users, Award, Zap } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  difficulty: string;
  services: string[];
  learningObjectives: string[];
  tutorialCount: number;
  serviceCount: number;
  tutorials?: any[];
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  category: string;
  steps: any[];
  learningObjectives: string[];
  serviceId?: string;
  serviceName?: string;
}

export default function TopicPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  
  const [topic, setTopic] = useState<Topic | null>(null);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopicData();
  }, [topicId]);

  const fetchTopicData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch topic information
      const topicResponse = await fetch(`/api/topics`);
      const topicResult = await topicResponse.json();
      
      let foundTopic: Topic | null = null;
      
      if (topicResult.success && topicResult.data) {
        foundTopic = topicResult.data.find((t: Topic) => t.id === topicId);
        if (foundTopic) {
          setTopic(foundTopic);
        } else {
          setError('Topic not found');
          return;
        }
      } else {
        setError('Failed to fetch topic data');
        return;
      }

      // Get tutorials directly from the topic
      if (foundTopic && foundTopic.tutorials) {
        const topicTutorials: Tutorial[] = foundTopic.tutorials.map((tutorial: any) => ({
          ...tutorial,
          serviceId: topicId, // Use topicId as serviceId for routing
          serviceName: foundTopic.name
        }));
        setTutorials(topicTutorials);
      } else {
        setTutorials([]);
      }
    } catch (err) {
      console.error('Error fetching topic data:', err);
      setError('Failed to load topic data');
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (icon: string) => {
    const iconMap: { [key: string]: any } = {
      '🌐': 'Globe',
      '☁️': 'Cloud',
      '🖥️': 'Server',
      '💾': 'HardDrive',
      '🔒': 'Shield',
      '📊': 'Database',
      '⚡': 'Zap',
      '📚': 'BookOpen'
    };
    return iconMap[icon] || 'BookOpen';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">☁️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Topic...</h1>
          <p className="text-gray-600">Fetching data from AWS DynamoDB</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Topic</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/" className="aws-button">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Topic Not Found</h1>
          <p className="text-gray-600 mb-4">The requested topic could not be found.</p>
          <Link href="/" className="aws-button">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className={`${topic.color} p-3 rounded-lg mr-4 text-white text-2xl`}>
                {topic.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{topic.name}</h1>
                <p className="text-gray-600">AWS Learning Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/games" className="aws-button flex items-center">
                <Play className="h-4 w-4 mr-2" />
                Games
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Topic Overview */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{topic.name}</h2>
              <p className="text-lg text-gray-600 mb-6">{topic.description}</p>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    topic.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {topic.difficulty}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <BookOpen className="h-5 w-5 mr-2" />
                  {topic.tutorialCount} tutorial{topic.tutorialCount !== 1 ? 's' : ''}
                </div>
                <div className="flex items-center text-gray-600">
                  <Target className="h-5 w-5 mr-2" />
                  {topic.serviceCount} service{topic.serviceCount !== 1 ? 's' : ''}
                </div>
              </div>

              {topic.services && topic.services.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Services Covered:</h3>
                  <div className="flex flex-wrap gap-2">
                    {topic.services.map((service, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {service.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Learn</h3>
                {topic.learningObjectives && topic.learningObjectives.length > 0 ? (
                  <div className="space-y-3">
                    {topic.learningObjectives.map((objective, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        </div>
                        <span className="text-gray-700">{objective}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">Core concepts and fundamentals</span>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">Hands-on practical tutorials</span>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">Real-world best practices</span>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">Interactive learning experience</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tutorials Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Tutorials</h2>
            <div className="text-sm text-gray-600">
              {tutorials.length} tutorial{tutorials.length !== 1 ? 's' : ''} available
            </div>
          </div>

          {tutorials.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tutorials Available Yet</h3>
              <p className="text-gray-600 mb-6">
                Tutorials for this topic are coming soon. Check back later for new content!
              </p>
              <Link href="/" className="aws-button">
                ← Back to All Topics
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial, index) => (
                <motion.div
                  key={tutorial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300 hover:border-aws-orange"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{tutorial.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{tutorial.description}</p>
                      
                      <div className="flex items-center space-x-3 mb-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          tutorial.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          tutorial.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tutorial.difficulty}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {tutorial.estimatedTime}
                        </div>
                      </div>

                      {tutorial.learningObjectives && tutorial.learningObjectives.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Learning Objectives:</h4>
                          <ul className="space-y-1">
                            {tutorial.learningObjectives.slice(0, 2).map((objective, objIndex) => (
                              <li key={objIndex} className="text-xs text-gray-600 flex items-start">
                                <span className="text-aws-orange mr-1">•</span>
                                {objective}
                              </li>
                            ))}
                            {tutorial.learningObjectives.length > 2 && (
                              <li className="text-xs text-gray-500">
                                +{tutorial.learningObjectives.length - 2} more objectives
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link
                      href={`/tutorial/${tutorial.serviceId}/${tutorial.id}`}
                      className="aws-button flex items-center"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Tutorial
                    </Link>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Related Topics */}
        <div className="mt-8 text-center">
          <Link href="/" className="aws-button">
            ← Back to All Topics
          </Link>
        </div>
      </main>
    </div>
  );
} 