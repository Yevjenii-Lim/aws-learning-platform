'use client';
import { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';

interface TutorialFormProps {
  topics: any[];
  services: any[];
  onSave: (tutorial: any) => void;
  onCancel: () => void;
  editingTutorial?: any;
}

interface Step {
  id: number;
  title: string;
  description: string;
  consoleInstructions: string[];
  cliCommands: string[];
  tips: string[];
}

export default function TutorialForm({ topics, services, onSave, onCancel, editingTutorial }: TutorialFormProps) {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    difficulty: 'beginner',
    estimatedTime: '',
    category: '',
    topicId: '',
    services: [] as string[],
    steps: [] as Step[],
    learningObjectives: [] as string[]
  });

  const [newObjective, setNewObjective] = useState('');
  const [newConsoleInstruction, setNewConsoleInstruction] = useState('');
  const [newCliCommand, setNewCliCommand] = useState('');
  const [newTip, setNewTip] = useState('');
  const [newService, setNewService] = useState('');


  useEffect(() => {
    if (editingTutorial) {
      setFormData({
        id: editingTutorial.id || '',
        title: editingTutorial.title || '',
        description: editingTutorial.description || '',
        difficulty: editingTutorial.difficulty || 'beginner',
        estimatedTime: editingTutorial.estimatedTime || '',
        category: editingTutorial.category || '',
        topicId: editingTutorial.topicId || '',
        services: editingTutorial.services || [],
        steps: editingTutorial.steps || [],
        learningObjectives: editingTutorial.learningObjectives || []
      });
    } else {
      // Generate a unique ID for new tutorial
      setFormData({
        id: `tutorial-${Date.now()}`,
        title: '',
        description: '',
        difficulty: 'beginner',
        estimatedTime: '',
        category: '',
        topicId: '',
        services: [],
        steps: [],
        learningObjectives: []
      });
    }
  }, [editingTutorial]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-set category based on selected topic
    if (field === 'topicId' && value) {
      const selectedTopic = topics.find(topic => topic.id === value);
      if (selectedTopic) {
        setFormData(prev => ({ 
          ...prev, 
          [field]: value,
          category: selectedTopic.id // Use topic ID as category
        }));
      }
    }
  };

  const addStep = () => {
    const newStep: Step = {
      id: formData.steps.length + 1,
      title: '',
      description: '',
      consoleInstructions: [],
      cliCommands: [],
      tips: []
    };
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const removeStep = (stepIndex: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, index) => index !== stepIndex).map((step, index) => ({
        ...step,
        id: index + 1
      }))
    }));
  };

  const moveStep = (stepIndex: number, direction: 'up' | 'down') => {
    const newSteps = [...formData.steps];
    if (direction === 'up' && stepIndex > 0) {
      [newSteps[stepIndex], newSteps[stepIndex - 1]] = [newSteps[stepIndex - 1], newSteps[stepIndex]];
    } else if (direction === 'down' && stepIndex < newSteps.length - 1) {
      [newSteps[stepIndex], newSteps[stepIndex + 1]] = [newSteps[stepIndex + 1], newSteps[stepIndex]];
    }
    
    // Update step IDs
    newSteps.forEach((step, index) => {
      step.id = index + 1;
    });
    
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const updateStep = (stepIndex: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, index) => 
        index === stepIndex ? { ...step, [field]: value } : step
      )
    }));
  };

  const addArrayItem = (stepIndex: number, field: 'consoleInstructions' | 'cliCommands' | 'tips', value: string) => {
    if (!value.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, index) => 
        index === stepIndex ? { 
          ...step, 
          [field]: [...step[field], value.trim()] 
        } : step
      )
    }));
  };

  const removeArrayItem = (stepIndex: number, field: 'consoleInstructions' | 'cliCommands' | 'tips', itemIndex: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, index) => 
        index === stepIndex ? { 
          ...step, 
          [field]: step[field].filter((_, i) => i !== itemIndex) 
        } : step
      )
    }));
  };

  const addLearningObjective = () => {
    if (!newObjective.trim()) return;
    setFormData(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, newObjective.trim()]
    }));
    setNewObjective('');
  };

  const removeLearningObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
    }));
  };

  const addService = () => {
    if (!newService.trim()) return;
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService.trim()]
    }));
    setNewService('');
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form data:', formData);
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.topicId || formData.steps.length === 0) {
      console.log('Validation failed:', {
        title: !!formData.title,
        description: !!formData.description,
        topicId: !!formData.topicId,
        stepsLength: formData.steps.length
      });
      alert('Please fill in all required fields and add at least one step.');
      return;
    }

    // Validate steps
    for (let i = 0; i < formData.steps.length; i++) {
      const step = formData.steps[i];
      if (!step.title || !step.description) {
        console.log(`Step ${i + 1} validation failed:`, step);
        alert(`Please fill in all required fields for step ${i + 1}.`);
        return;
      }
    }

    console.log('Validation passed, calling onSave');
    onSave(formData);
  };



  const getSelectedTopic = () => {
    return topics.find(topic => topic.id === formData.topicId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              {editingTutorial ? 'Edit Tutorial' : 'Add New Tutorial'}
            </h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tutorial Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                placeholder="e.g., Create a VPC"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic *
              </label>
              <select
                value={formData.topicId}
                onChange={(e) => handleInputChange('topicId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                required
              >
                <option value="">Select a topic</option>
                {topics.map(topic => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty *
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Time *
              </label>
              <input
                type="text"
                value={formData.estimatedTime}
                onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                placeholder="e.g., 15 minutes"
                required
              />
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
              placeholder="Brief description of what this tutorial covers..."
              required
            />
          </div>

          {/* AWS Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AWS Services Covered
            </label>
            <div className="space-y-2">
              {formData.services.map((service, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="flex-1 px-3 py-2 bg-blue-50 rounded-md text-sm text-gray-900 border border-blue-200">
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
                <select
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                >
                  <option value="">Select a common AWS service</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                  placeholder="Or type custom service name"
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

          {/* Topic Association Preview */}
          {formData.topicId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Topic Association</h4>
              <div className="text-sm text-blue-800">
                {(() => {
                  const selectedTopic = topics.find(topic => topic.id === formData.topicId);
                  
                  if (selectedTopic) {
                    return (
                      <div>
                        <p><strong>Selected Topic:</strong> {selectedTopic.name}</p>
                        <p><strong>Description:</strong> {selectedTopic.description}</p>
                        <p><strong>Difficulty:</strong> {selectedTopic.difficulty}</p>
                        <p><strong>Current Tutorials:</strong> {selectedTopic.tutorialCount || 0}</p>
                      </div>
                    );
                  } else {
                    return (
                      <p className="text-orange-600">
                        <strong>Note:</strong> Please select a topic for this tutorial.
                      </p>
                    );
                  }
                })()}
              </div>
            </div>
          )}

          {/* Learning Objectives */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Objectives
            </label>
            <div className="space-y-2">
              {formData.learningObjectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="flex-1 px-3 py-2 bg-orange-50 rounded-md text-sm text-gray-900 border border-orange-200">
                    {objective}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLearningObjective(index)}
                    className="p-1 text-red-600 hover:text-red-800"
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                  placeholder="Add a learning objective..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLearningObjective())}
                />
                <button
                  type="button"
                  onClick={addLearningObjective}
                  className="px-4 py-2 bg-aws-orange text-white rounded-md hover:bg-orange-600"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Tutorial Steps *
              </label>
              <button
                type="button"
                onClick={addStep}
                className="px-4 py-2 bg-aws-orange text-white rounded-md hover:bg-orange-600 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.steps.map((step, stepIndex) => (
                <div key={stepIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Step {step.id}</h4>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => moveStep(stepIndex, 'up')}
                        disabled={stepIndex === 0}
                        className="p-1 text-gray-600 hover:text-gray-800 disabled:text-gray-300"
                      >
                        <MoveUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStep(stepIndex, 'down')}
                        disabled={stepIndex === formData.steps.length - 1}
                        className="p-1 text-gray-600 hover:text-gray-800 disabled:text-gray-300"
                      >
                        <MoveDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeStep(stepIndex)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Step Title *
                      </label>
                                             <input
                         type="text"
                         value={step.title}
                         onChange={(e) => updateStep(stepIndex, 'title', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                         placeholder="e.g., Navigate to VPC Dashboard"
                         required
                       />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                                             <textarea
                         value={step.description}
                         onChange={(e) => updateStep(stepIndex, 'description', e.target.value)}
                         rows={2}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                         placeholder="Brief description of this step..."
                         required
                       />
                    </div>
                  </div>

                  {/* Console Instructions */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Console Instructions
                    </label>
                    <div className="space-y-2">
                      {step.consoleInstructions.map((instruction, index) => (
                        <div key={index} className="flex items-center space-x-2">
                                                   <span className="flex-1 px-3 py-2 bg-orange-50 rounded-md text-sm text-gray-900 border border-orange-200">
                           {instruction}
                         </span>
                          <button
                            type="button"
                            onClick={() => removeArrayItem(stepIndex, 'consoleInstructions', index)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                                                 <input
                           type="text"
                           value={newConsoleInstruction}
                           onChange={(e) => setNewConsoleInstruction(e.target.value)}
                           className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                           placeholder="Add console instruction..."
                           onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem(stepIndex, 'consoleInstructions', newConsoleInstruction), setNewConsoleInstruction(''))}
                         />
                        <button
                          type="button"
                          onClick={() => {
                            addArrayItem(stepIndex, 'consoleInstructions', newConsoleInstruction);
                            setNewConsoleInstruction('');
                          }}
                          className="px-4 py-2 bg-aws-orange text-white rounded-md hover:bg-orange-600"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* CLI Commands */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CLI Commands
                    </label>
                    <div className="space-y-2">
                      {step.cliCommands.map((command, index) => (
                        <div key={index} className="flex items-center space-x-2">
                                                   <span className="flex-1 px-3 py-2 bg-orange-50 rounded-md text-sm font-mono text-gray-900 border border-orange-200">
                           {command}
                         </span>
                          <button
                            type="button"
                            onClick={() => removeArrayItem(stepIndex, 'cliCommands', index)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                                                 <input
                           type="text"
                           value={newCliCommand}
                           onChange={(e) => setNewCliCommand(e.target.value)}
                           className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent font-mono text-gray-900"
                           placeholder="Add CLI command..."
                           onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem(stepIndex, 'cliCommands', newCliCommand), setNewCliCommand(''))}
                         />
                        <button
                          type="button"
                          onClick={() => {
                            addArrayItem(stepIndex, 'cliCommands', newCliCommand);
                            setNewCliCommand('');
                          }}
                          className="px-4 py-2 bg-aws-orange text-white rounded-md hover:bg-orange-600"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tips
                    </label>
                    <div className="space-y-2">
                      {step.tips.map((tip, index) => (
                        <div key={index} className="flex items-center space-x-2">
                                                   <span className="flex-1 px-3 py-2 bg-orange-50 rounded-md text-sm text-gray-900 border border-orange-200">
                           {tip}
                         </span>
                          <button
                            type="button"
                            onClick={() => removeArrayItem(stepIndex, 'tips', index)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                                                 <input
                           type="text"
                           value={newTip}
                           onChange={(e) => setNewTip(e.target.value)}
                           className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900"
                           placeholder="Add a tip..."
                           onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem(stepIndex, 'tips', newTip), setNewTip(''))}
                         />
                        <button
                          type="button"
                          onClick={() => {
                            addArrayItem(stepIndex, 'tips', newTip);
                            setNewTip('');
                          }}
                          className="px-4 py-2 bg-aws-orange text-white rounded-md hover:bg-orange-600"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-aws-orange text-white rounded-lg hover:bg-orange-600 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{editingTutorial ? 'Update Tutorial' : 'Create Tutorial'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 