'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Clock, Target, ChevronRight, Plus, Play, Gamepad2, ArrowRight, Users, Award, Zap, Cloud, Server, HardDrive, Shield, Database, Globe, Lock, Cpu, Settings } from 'lucide-react';
import Link from 'next/link';
import ClientOnly from './components/ClientOnly';

interface LearningTopic {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tutorials: any[];
  difficulty?: string;
  tutorialCount: number;
  services: string[];
  serviceNames: string[];
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [learningTopics, setLearningTopics] = useState<LearningTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLearningTopics();
  }, []);

  const fetchLearningTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both topics and lessons to get service names
      const [topicsResponse, lessonsResponse] = await Promise.all([
        fetch('/api/topics'),
        fetch('/api/lessons')
      ]);
      
      const topicsResult = await topicsResponse.json();
      const lessonsResult = await lessonsResponse.json();
      
      if (topicsResult.success && topicsResult.data) {
        // Create a map of service IDs to service names
        const serviceNameMap: { [key: string]: string } = {};
        if (lessonsResult.success && lessonsResult.data) {
          lessonsResult.data.forEach((service: any) => {
            serviceNameMap[service.id] = service.name;
          });
        }
        
        // Transform the data to match our interface
        const transformedTopics = topicsResult.data.map((topic: any) => {
          // Aggregate services from all tutorials in this topic
          const allServices = new Set<string>();
          if (topic.tutorials && Array.isArray(topic.tutorials)) {
            topic.tutorials.forEach((tutorial: any) => {
              if (tutorial.services && Array.isArray(tutorial.services)) {
                tutorial.services.forEach((service: string) => {
                  allServices.add(service);
                });
              }
            });
          }
          
          const transformedTopic = {
            id: topic.id,
            name: topic.name,
            description: topic.description,
            icon: topic.icon || '📚',
            color: topic.color || 'bg-blue-500',
            tutorials: topic.tutorials || [],
            difficulty: topic.difficulty || 'Beginner',
            tutorialCount: topic.tutorialCount,
            services: Array.from(allServices),
            serviceNames: Array.from(allServices).map((serviceId: string) => 
              serviceNameMap[serviceId] || serviceId.toUpperCase()
            )
          };
          

          
          return transformedTopic;
        });
        
        setLearningTopics(transformedTopics);
      } else {
        setError('Failed to fetch learning topics');
      }
    } catch (err) {
      console.error('Error fetching learning topics:', err);
      setError('Failed to load learning topics');
    } finally {
      setLoading(false);
    }
  };

  const filteredTopics = learningTopics.filter(topic =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIconComponent = (icon: string) => {
    const iconMap: { [key: string]: any } = {
      '🌐': Globe,
      '☁️': Cloud,
      '🖥️': Server,
      '💾': HardDrive,
      '🔒': Shield,
      '📊': Database,
      '⚡': Cpu,
      '📚': BookOpen
    };
    return iconMap[icon] || BookOpen;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">☁️</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AWS Learning Platform</h1>
                <p className="text-gray-600">Interactive learning with visualizations and step-by-step guides</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search topics"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ color: 'black' }}
                />
                <ClientOnly>
                  {searchTerm && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                      {filteredTopics.length} results
                    </div>
                  )}
                </ClientOnly>
              </div>
              <Link href="/games" className="aws-button flex items-center">
                <Gamepad2 className="h-4 w-4 mr-2" />
                Games
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <ClientOnly>
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Choose Your Learning Path
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Select a topic below to start your AWS learning journey. Each topic includes step-by-step tutorials, 
              visual guides, and hands-on practice.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center"
            >
              <Link
                href="/intro"
                className="aws-button flex items-center px-8 py-4 text-lg font-semibold"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Here - Learn About AWS
              </Link>
            </motion.div>
          </ClientOnly>
        </div>

        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Learning Topics</h3>
            <div className="text-sm text-gray-600">
              {loading ? 'Loading...' : `${filteredTopics.length} of ${learningTopics.length} topics`}
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-600">Loading learning topics from AWS...</div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{error}</div>
              <button 
                onClick={fetchLearningTopics}
                className="aws-button"
              >
                Try Again
              </button>
            </div>
          ) : learningTopics.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-600 mb-4">No learning topics found.</div>
              <Link href="/admin" className="aws-button">
                Add Topics in Admin Panel
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic, index) => {
                const IconComponent = getIconComponent(topic.icon);
                return (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-aws-orange"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`${topic.color} p-3 rounded-lg mr-4 text-white`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{topic.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                              topic.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {topic.difficulty}
                            </span>
                                                       <span className="text-sm text-gray-500">
                             {topic.tutorialCount} tutorial{topic.tutorialCount !== 1 ? 's' : ''}
                           </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{topic.description}</p>
                    
                                         <div className="mb-4">
                       <div className="text-sm font-medium text-gray-700 mb-2">Services covered:</div>
                       <div className="flex flex-wrap gap-1">
                         {topic.serviceNames && topic.serviceNames.map((serviceName: string, serviceIndex: number) => (
                           <span
                             key={serviceIndex}
                             className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                           >
                             {serviceName}
                           </span>
                         ))}
                       </div>
                     </div>
                    
                                         <div className="flex justify-between items-center">
                       <Link 
                         href={`/topics/${topic.id}`}
                         className="aws-button flex items-center"
                       >
                         <Play className="h-4 w-4 mr-2" />
                         {topic.tutorialCount > 0 ? 'Start Learning' : 'View Topic'}
                       </Link>
                       <ChevronRight className="h-5 w-5 text-gray-400" />
                     </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/tutorial/networking/create-vpc" className="group">
              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-aws-orange hover:bg-orange-50 transition-all duration-300">
                <div className="bg-blue-500 p-3 rounded-lg mr-4 text-white">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-aws-orange">Create a VPC</h4>
                  <p className="text-sm text-gray-600">Step-by-step VPC creation guide</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-aws-orange" />
              </div>
            </Link>
            
            <Link href="/tutorial/compute/launch-instance" className="group">
              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-aws-orange hover:bg-orange-50 transition-all duration-300">
                <div className="bg-green-500 p-3 rounded-lg mr-4 text-white">
                  <Server className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-aws-orange">Launch EC2 Instance</h4>
                  <p className="text-sm text-gray-600">Complete EC2 setup tutorial</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-aws-orange" />
              </div>
            </Link>
            
            <Link href="/tutorial/storage/create-bucket" className="group">
              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-aws-orange hover:bg-orange-50 transition-all duration-300">
                <div className="bg-orange-500 p-3 rounded-lg mr-4 text-white">
                  <HardDrive className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-aws-orange">Create S3 Bucket</h4>
                  <p className="text-sm text-gray-600">S3 bucket configuration guide</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-aws-orange" />
              </div>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-2">☁️</div>
                <h3 className="text-lg font-semibold">AWS Learning Platform</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Master AWS services through interactive tutorials, visual guides, and hands-on practice.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Users className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Award className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Zap className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Learning</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Topics</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Games</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Flashcards</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Topics</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Networking</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Compute</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Storage</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Feedback</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 AWS Learning Platform. Built with Next.js and AWS services.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 