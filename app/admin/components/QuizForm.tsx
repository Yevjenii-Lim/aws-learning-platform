'use client';

import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface QuizFormProps {
  quiz?: any;
  onSave: (quiz: any) => void;
  onCancel: () => void;
}

const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const CATEGORIES = [
  'networking',
  'compute', 
  'storage',
  'security',
  'database',
  'monitoring',
  'serverless',
  'general'
];

export default function QuizForm({ quiz, onSave, onCancel }: QuizFormProps) {
  const [formData, setFormData] = useState({
    id: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    category: 'general',
    difficulty: 'Beginner',
    tags: [] as string[]
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (quiz) {
      setFormData({
        id: quiz.id || '',
        question: quiz.question || '',
        options: quiz.options || ['', '', '', ''],
        correctAnswer: quiz.correctAnswer || 0,
        explanation: quiz.explanation || '',
        category: quiz.category || 'general',
        difficulty: quiz.difficulty || 'Beginner',
        tags: quiz.tags || []
      });
    }
  }, [quiz]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim()) {
      alert('Please enter a question');
      return;
    }

    if (formData.options.some(option => !option.trim())) {
      alert('Please fill in all answer options');
      return;
    }

    if (formData.explanation.trim() === '') {
      alert('Please provide an explanation');
      return;
    }

    const quizData = {
      ...formData,
      id: formData.id || `quiz-${Date.now()}`
    };

    onSave(quizData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {quiz ? 'Edit Quiz Question' : 'Add New Quiz Question'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                required
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
              >
                {DIFFICULTY_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question *
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => handleInputChange('question', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
              placeholder="Enter your quiz question..."
              required
            />
          </div>

          {/* Answer Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer Options *
            </label>
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.correctAnswer === index}
                    onChange={() => handleInputChange('correctAnswer', index)}
                    className="text-aws-orange focus:ring-aws-orange"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  {formData.correctAnswer === index && (
                    <span className="text-green-600 text-sm font-medium">Correct Answer</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Explanation *
            </label>
            <textarea
              value={formData.explanation}
              onChange={(e) => handleInputChange('explanation', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
              placeholder="Explain why this is the correct answer..."
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="space-y-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="flex-1 px-3 py-2 bg-blue-50 rounded-md text-sm text-gray-900 border border-blue-200">
                    {tag}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                  placeholder="Add a tag (e.g., EC2, S3, VPC)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-aws-orange text-white rounded-md hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {formData.category} • {formData.difficulty}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{formData.question || 'Question preview...'}</h4>
                <div className="space-y-2">
                  {formData.options.map((option, index) => (
                    <div key={index} className={`flex items-center space-x-2 p-2 rounded ${
                      index === formData.correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        index === formData.correctAnswer ? 'border-green-500 bg-green-500' : 'border-gray-300'
                      }`}>
                        {index === formData.correctAnswer && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-sm text-gray-700">{option || `Option ${index + 1}`}</span>
                    </div>
                  ))}
                </div>
              </div>
              {formData.explanation && (
                <div className="text-sm text-gray-600">
                  <strong>Explanation:</strong> {formData.explanation}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-aws-orange text-white rounded-lg hover:bg-orange-600 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {quiz ? 'Update Question' : 'Create Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 