'use client';

import { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';

interface FlashcardFormProps {
  flashcard?: any;
  onSave: (flashcard: any) => void;
  onCancel: () => void;
}

export default function FlashcardForm({ flashcard, onSave, onCancel }: FlashcardFormProps) {
  const [formData, setFormData] = useState({
    id: '',
    front: '',
    back: '',
    category: '',
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (flashcard) {
      setFormData({
        id: flashcard.id || '',
        front: flashcard.front || '',
        back: flashcard.back || '',
        category: flashcard.category || '',
        tags: flashcard.tags || []
      });
    } else {
      setFormData({
        id: '',
        front: '',
        back: '',
        category: '',
        tags: []
      });
    }
  }, [flashcard]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.front || !formData.back || !formData.category) {
      alert('Please fill in all required fields (Front, Back, and Category).');
      return;
    }

    // Generate ID if not provided
    const flashcardData = {
      ...formData,
      id: formData.id || `flashcard-${Date.now()}`
    };

    onSave(flashcardData);
  };

  const categoryOptions = [
    'compute',
    'storage', 
    'networking',
    'security',
    'monitoring',
    'serverless',
    'database',
    'general'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              {flashcard ? 'Edit Flashcard' : 'Add New Flashcard'}
            </h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Selection */}
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
              <option value="">Select a category</option>
              {categoryOptions.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Front of Card */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Front (Question) *
            </label>
            <textarea
              value={formData.front}
              onChange={(e) => handleInputChange('front', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
              placeholder="Enter the question or front of the flashcard..."
              required
            />
          </div>

          {/* Back of Card */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Back (Answer) *
            </label>
            <textarea
              value={formData.back}
              onChange={(e) => handleInputChange('back', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
              placeholder="Enter the answer or back of the flashcard..."
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-aws-orange text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            {/* Display existing tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Preview:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded border">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Front:</h4>
                <p className="text-gray-900">{formData.front || 'No content yet'}</p>
              </div>
              <div className="bg-white p-4 rounded border">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Back:</h4>
                <p className="text-gray-900">{formData.back || 'No content yet'}</p>
              </div>
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
              className="aws-button flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {flashcard ? 'Update Flashcard' : 'Create Flashcard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 