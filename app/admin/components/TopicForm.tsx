'use client';

import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface TopicFormProps {
  topic?: any;
  onSave: (topic: any) => void;
  onCancel: () => void;
}

const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const COLORS = [
  'bg-blue-500',
  'bg-green-500', 
  'bg-orange-500',
  'bg-purple-500',
  'bg-red-500',
  'bg-indigo-500',
  'bg-pink-500',
  'bg-yellow-500'
];
const ICONS = ['📚', '🌐', '☁️', '🖥️', '💾', '🔒', '📊', '⚡', '🚀', '🔧', '🎯', '💡'];

export default function TopicForm({ topic, onSave, onCancel }: TopicFormProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    icon: '📚',
    color: 'bg-blue-500',
    difficulty: 'Beginner',
    services: [] as string[],
    learningObjectives: [] as string[],
    tutorialCount: 0,
    serviceCount: 0
  });

  const [newService, setNewService] = useState('');
  const [newObjective, setNewObjective] = useState('');

  useEffect(() => {
    if (topic) {
      setFormData({
        id: topic.id || '',
        name: topic.name || '',
        description: topic.description || '',
        icon: topic.icon || '📚',
        color: topic.color || 'bg-blue-500',
        difficulty: topic.difficulty || 'Beginner',
        services: topic.services || [],
        learningObjectives: topic.learningObjectives || [],
        tutorialCount: topic.tutorialCount || 0,
        serviceCount: topic.serviceCount || 0
      });
    }
  }, [topic]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()],
        serviceCount: prev.services.length + 1
      }));
      setNewService('');
    }
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
      serviceCount: prev.services.length - 1
    }));
  };

  const addObjective = () => {
    if (newObjective.trim() && !formData.learningObjectives.includes(newObjective.trim())) {
      setFormData(prev => ({
        ...prev,
        learningObjectives: [...prev.learningObjectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a topic name');
      return;
    }

    if (!formData.description.trim()) {
      alert('Please enter a topic description');
      return;
    }

    const topicData = {
      ...formData,
      id: formData.id || `topic-${Date.now()}`,
      serviceCount: formData.services.length
    };

    onSave(topicData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {topic ? 'Edit Topic' : 'Add New Topic'}
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
                Topic Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                placeholder="e.g., Networking & Security"
                required
              />
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
              placeholder="Describe what this topic covers..."
              required
            />
          </div>

          {/* Visual Customization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-6 gap-2">
                {ICONS.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleInputChange('icon', icon)}
                    className={`p-3 rounded-lg border-2 text-2xl ${
                      formData.icon === icon 
                        ? 'border-aws-orange bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Theme
              </label>
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleInputChange('color', color)}
                    className={`p-3 rounded-lg border-2 ${
                      formData.color === color 
                        ? 'border-aws-orange' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-6 h-6 ${color} rounded`}></div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AWS Services Covered
            </label>
            <div className="space-y-2">
              {formData.services.map((service, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="flex-1 px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900 border border-gray-200">
                    {service}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                  placeholder="Add AWS service (e.g., EC2, S3, VPC)"
                />
                <button
                  type="button"
                  onClick={addService}
                  className="px-4 py-2 bg-aws-orange text-white rounded-md hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What You'll Learn
            </label>
            <div className="space-y-2">
              {formData.learningObjectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="flex-1 px-3 py-2 bg-blue-50 rounded-md text-sm text-gray-900 border border-blue-200">
                    {objective}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeObjective(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                  placeholder="Add learning objective (e.g., Core concepts and fundamentals)"
                />
                <button
                  type="button"
                  onClick={addObjective}
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
            <div className="flex items-center">
              <div className={`${formData.color} p-3 rounded-lg mr-4 text-white text-2xl`}>
                {formData.icon}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{formData.name || 'Topic Name'}</h4>
                <p className="text-gray-600">{formData.description || 'Topic description...'}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    formData.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    formData.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {formData.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formData.services.length} service{formData.services.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              {formData.learningObjectives.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Learning Objectives:</h5>
                  <div className="space-y-1">
                    {formData.learningObjectives.slice(0, 3).map((objective, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                        </div>
                        <span className="text-xs text-gray-600">{objective}</span>
                      </div>
                    ))}
                    {formData.learningObjectives.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{formData.learningObjectives.length - 3} more objectives
                      </span>
                    )}
                  </div>
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
              {topic ? 'Update Topic' : 'Create Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 