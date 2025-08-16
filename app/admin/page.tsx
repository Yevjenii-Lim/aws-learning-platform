'use client';

import { useState, useEffect } from 'react';
import { Settings, BookOpen, FileText, CreditCard, HelpCircle, Plus, Edit, Trash2, X, Eye, EyeOff, Search } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('topics');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Real data from AWS DynamoDB
  const [topics, setTopics] = useState<any[]>([]);
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

  // Fetch data from AWS DynamoDB
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch topics
      const topicsResponse = await fetch('/api/topics');
      const topicsData = await topicsResponse.json();
      console.log('Topics API response:', topicsData);
      if (topicsData.success) {
        console.log('Setting topics:', topicsData.data);
        setTopics(topicsData.data || []);
      }

      // Fetch flashcards
      const flashcardsResponse = await fetch('/api/flashcards');
      const flashcardsData = await flashcardsResponse.json();
      if (flashcardsData.success) {
        setFlashcards(flashcardsData.data || []);
      }

      // Fetch quiz questions
      const quizResponse = await fetch('/api/quiz');
      const quizData = await quizResponse.json();
      if (quizData.success) {
        setQuizQuestions(quizData.data || []);
      }

      // Fetch tutorials from lessons API
      const lessonsResponse = await fetch('/api/lessons');
      const lessonsData = await lessonsResponse.json();
      
      // Extract tutorials from lessons data
      const allTutorials: any[] = [];
      if (lessonsData.success && lessonsData.data) {
        lessonsData.data.forEach((service: any) => {
          if (service.tutorials && Array.isArray(service.tutorials)) {
            service.tutorials.forEach((tutorial: any) => {
              allTutorials.push({
                ...tutorial,
                topicId: service.id,
                topicName: service.name
              });
            });
          }
        });
      }
      setTutorials(allTutorials);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Removed password authentication

  const handleAdd = (type: string) => {
    setIsAdding(true);
    setEditingItem(null);
  };

  const handleEdit = (item: any, type: string) => {
    setEditingItem({ ...item, type });
    setIsAdding(false);
  };

  const handleDelete = async (id: string, type: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        // TODO: Implement actual delete API calls
        console.log(`Deleting ${type} with id: ${id}`);
        
        // For now, just remove from local state
        switch (type) {
          case 'topics':
            setTopics(topics.filter((t: any) => t.id !== id));
            break;
          case 'tutorials':
            setTutorials(tutorials.filter((t: any) => t.id !== id));
            break;
          case 'flashcards':
            setFlashcards(flashcards.filter((f: any) => f.id !== id));
            break;
          case 'quiz':
            setQuizQuestions(quizQuestions.filter((q: any) => q.id !== id));
            break;
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item');
      }
    }
  };

  const handleSave = async (item: any, type: string) => {
    try {
      // TODO: Implement actual save API calls
      console.log(`Saving ${type}:`, item);
      
      // For now, just update local state
      switch (type) {
        case 'topics':
          if (editingItem) {
            setTopics(topics.map((t: any) => t.id === item.id ? item : t));
          } else {
            setTopics([...topics, { ...item, id: Date.now().toString() }]);
          }
          break;
        case 'tutorials':
          if (editingItem) {
            setTutorials(tutorials.map((t: any) => t.id === item.id ? item : t));
          } else {
            setTutorials([...tutorials, { ...item, id: Date.now().toString() }]);
          }
          break;
        case 'flashcards':
          if (editingItem) {
            setFlashcards(flashcards.map((f: any) => f.id === item.id ? item : f));
          } else {
            setFlashcards([...flashcards, { ...item, id: Date.now().toString() }]);
          }
          break;
        case 'quiz':
          if (editingItem) {
            setQuizQuestions(quizQuestions.map((q: any) => q.id === item.id ? item : q));
          } else {
            setQuizQuestions([...quizQuestions, { ...item, id: Date.now().toString() }]);
          }
          break;
      }
      setIsAdding(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error saving item');
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingItem(null);
  };

  // Removed authentication check - admin panel is now directly accessible

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-gray-600">Manage topics, tutorials, flashcards, and quizzes</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchAllData}
                disabled={loading}
                className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'topics', label: 'Topics', icon: BookOpen },
                { id: 'tutorials', label: 'Tutorials', icon: FileText },
                { id: 'flashcards', label: 'Flashcards', icon: CreditCard },
                { id: 'quiz', label: 'Quiz Questions', icon: HelpCircle }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-500'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Search and Add Button */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => handleAdd(activeTab)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {activeTab.slice(0, -1)}
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="text-gray-600">Loading data from AWS...</div>
            </div>
          )}

          {/* Form Modal */}
          {(isAdding || editingItem) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-gray-600">Form component temporarily disabled.</p>
                <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Topics Tab */}
          {activeTab === 'topics' && (
            <div className="space-y-4">
              {topics.length === 0 && !loading ? (
                <div className="text-center py-8 text-gray-600">
                  No topics found. Click "Refresh Data" to load from AWS.
                </div>
              ) : (
                topics
                  .filter((topic: any) => 
                    topic.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    topic.description?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((topic: any) => (
                    <div key={topic.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className={`${topic.color || 'bg-blue-500'} p-3 rounded-lg mr-4 text-white text-2xl`}>
                            {topic.icon || '📚'}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{topic.name}</h3>
                            <p className="text-gray-600">{topic.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                                topic.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {topic.difficulty || 'Beginner'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {topic.tutorialCount || 0} tutorials
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(topic, 'topics')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(topic.id, 'topics')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}

          {/* Tutorials Tab */}
          {activeTab === 'tutorials' && (
            <div className="space-y-4">
              {tutorials.length === 0 && !loading ? (
                <div className="text-center py-8 text-gray-600">
                  No tutorials found. Click "Refresh Data" to load from AWS.
                </div>
              ) : (
                tutorials
                  .filter((tutorial: any) => 
                    tutorial.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    tutorial.description?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((tutorial: any) => (
                    <div key={tutorial.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{tutorial.title}</h3>
                          <p className="text-gray-600">{tutorial.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              tutorial.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                              tutorial.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {tutorial.difficulty || 'Beginner'}
                            </span>
                            <span className="text-sm text-gray-500">{tutorial.estimatedTime || 'N/A'}</span>
                            <span className="text-sm text-gray-500">Topic: {tutorial.topicName || tutorial.topicId || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(tutorial, 'tutorials')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tutorial.id, 'tutorials')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}

          {/* Flashcards Tab */}
          {activeTab === 'flashcards' && (
            <div className="space-y-4">
              {flashcards.length === 0 && !loading ? (
                <div className="text-center py-8 text-gray-600">
                  No flashcards found. Click "Refresh Data" to load from AWS.
                </div>
              ) : (
                flashcards
                  .filter((flashcard: any) => 
                    flashcard.front?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    flashcard.back?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((flashcard: any) => (
                    <div key={flashcard.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{flashcard.front}</h3>
                          <p className="text-gray-600 mb-2">{flashcard.back}</p>
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              flashcard.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                              flashcard.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {flashcard.difficulty || 'Beginner'}
                            </span>
                            <span className="text-sm text-gray-500">Category: {flashcard.category || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(flashcard, 'flashcards')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(flashcard.id, 'flashcards')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}

          {/* Quiz Questions Tab */}
          {activeTab === 'quiz' && (
            <div className="space-y-4">
              {quizQuestions.length === 0 && !loading ? (
                <div className="text-center py-8 text-gray-600">
                  No quiz questions found. Click "Refresh Data" to load from AWS.
                </div>
              ) : (
                quizQuestions
                  .filter((question: any) => 
                    question.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    question.explanation?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((question: any) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{question.question}</h3>
                          <div className="space-y-1 mb-2">
                            {question.options?.map((option: string, index: number) => (
                              <div key={index} className={`text-sm ${
                                index === question.correctAnswer ? 'text-green-600 font-medium' : 'text-gray-600'
                              }`}>
                                {index + 1}. {option}
                                {index === question.correctAnswer && ' ✓'}
                              </div>
                            ))}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{question.explanation}</p>
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              question.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                              question.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {question.difficulty || 'Beginner'}
                            </span>
                            <span className="text-sm text-gray-500">Category: {question.category || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(question, 'quiz')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(question.id, 'quiz')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 