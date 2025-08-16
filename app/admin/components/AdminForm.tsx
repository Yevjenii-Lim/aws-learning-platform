'use client';

import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

interface AdminFormProps {
  type: 'topics' | 'tutorials' | 'flashcards' | 'quiz';
  item?: any;
  onSave: (item: any, type: string) => void;
  onCancel: () => void;
}

export default function AdminForm({ type, item, onSave, onCancel }: AdminFormProps) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        title: '',
        description: '',
        difficulty: 'Beginner',
        category: '',
        icon: '📚',
        color: 'bg-blue-500',
        services: [],
        tutorials: 0,
        estimatedTime: '',
        topicId: '',
        question: '',
        answer: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      });
    }
  }, [item]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, type);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {item ? 'Edit' : 'Add'} {type.slice(0, -1)}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aws-orange focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aws-orange focus:border-transparent"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={formData.difficulty || 'Beginner'}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aws-orange focus:border-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aws-orange focus:border-transparent"
                  placeholder="networking"
                />
              </div>
            </div>
            
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
                className="aws-button flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {item ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 