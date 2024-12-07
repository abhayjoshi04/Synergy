import React, { useState } from 'react';
import { ArrowLeft, Trash2, Save, Edit, Plus, Clock, Calendar } from 'lucide-react';
import { Guide, GuideStep } from '../../../types/support';
import { motion, AnimatePresence } from 'framer-motion';

interface GuideDetailsProps {
  guide: Guide;
  onBack: () => void;
  onUpdateGuide: (updatedGuide: Guide) => void;
  onDeleteGuide: (guideId: string) => void;
}

export function GuideDetails({
  guide,
  onBack,
  onUpdateGuide,
  onDeleteGuide,
}: GuideDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedGuide, setUpdatedGuide] = useState<Guide>(guide);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const handleAddStep = () => {
    const newStep: GuideStep = {
      id: `step-${Date.now()}`,
      title: '',
      description: '',
      duration: '',
      status: 'not-started',
      content: '',
      resources: [],
      checkpoints: []
    };
    setUpdatedGuide((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
  };

  const handleUpdateStep = (
    index: number,
    field: keyof GuideStep,
    value: string
  ) => {
    const updatedSteps = [...updatedGuide.steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setUpdatedGuide((prev) => ({
      ...prev,
      steps: updatedSteps,
    }));
  };

  const handleDeleteStep = (stepIndex: number) => {
    setUpdatedGuide((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, index) => index !== stepIndex),
    }));
  };

  const handleSaveChanges = () => {
    onUpdateGuide(updatedGuide);
    setIsEditing(false);
  };

  const handleStepStatusChange = (stepId: string, status: GuideStep['status']) => {
    if (!isEditing) {
      const updatedSteps = guide.steps.map(step =>
        step.id === stepId ? { ...step, status } : step
      );
      onUpdateGuide({ ...guide, steps: updatedSteps });
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Guides
      </button>

      <div className="bg-white rounded-lg p-6 shadow-md">
        {!isEditing ? (
          <div>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{guide.title}</h2>
                <p className="text-gray-600">{guide.description}</p>
              </div>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                {guide.category}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Duration: {guide.estimatedDuration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{guide.steps.length} Steps</span>
              </div>
            </div>

            <div className="space-y-4">
              {guide.steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  layout
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                    className="w-full text-left"
                  >
                    <div className="p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-medium">
                            {index + 1}
                          </span>
                          <div>
                            <h4 className="font-medium">{step.title}</h4>
                            <p className="text-sm text-gray-500">{step.duration}</p>
                          </div>
                        </div>
                        <select
                          value={step.status}
                          onChange={(e) => handleStepStatusChange(step.id, e.target.value as GuideStep['status'])}
                          onClick={(e) => e.stopPropagation()}
                          className={`px-3 py-1 rounded-full text-sm ${
                            step.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : step.status === 'in-progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="not-started">Not Started</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedStep === step.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-200"
                      >
                        <div className="p-4">
                          <p className="text-gray-600 mb-4">{step.description}</p>
                          {step.content && (
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                              <h5 className="font-medium mb-2">Detailed Instructions</h5>
                              <p className="text-gray-600">{step.content}</p>
                            </div>
                          )}
                          {step.resources && step.resources.length > 0 && (
                            <div>
                              <h5 className="font-medium mb-2">Resources</h5>
                              <ul className="list-disc list-inside text-indigo-600">
                                {step.resources.map((resource, i) => (
                                  <li key={i}>
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                      {resource.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {step.checkpoints && step.checkpoints.length > 0 && (
                            <div className="mt-4">
                              <h5 className="font-medium mb-2">Checkpoints</h5>
                              <ul className="space-y-2">
                                {step.checkpoints.map((checkpoint, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={checkpoint.completed}
                                      onChange={() => {
                                        const updatedSteps = guide.steps.map(s =>
                                          s.id === step.id
                                            ? {
                                                ...s,
                                                checkpoints: s.checkpoints.map((c, idx) =>
                                                  idx === i ? { ...c, completed: !c.completed } : c
                                                )
                                              }
                                            : s
                                        );
                                        onUpdateGuide({ ...guide, steps: updatedSteps });
                                      }}
                                      className="rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-gray-700">{checkpoint.title}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50"
              >
                <Edit className="h-4 w-4" />
                Edit Guide
              </button>
              <button
                onClick={() => onDeleteGuide(guide.id)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete Guide
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <input
              type="text"
              value={updatedGuide.title}
              onChange={(e) =>
                setUpdatedGuide({ ...updatedGuide, title: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Guide Title"
            />
            <textarea
              value={updatedGuide.description}
              onChange={(e) =>
                setUpdatedGuide({ ...updatedGuide, description: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Guide Description"
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={updatedGuide.category}
                  onChange={(e) =>
                    setUpdatedGuide({
                      ...updatedGuide,
                      category: e.target.value as Guide['category']
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="infrastructure">Infrastructure</option>
                  <option value="academic">Academic</option>
                  <option value="administrative">Administrative</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  value={updatedGuide.estimatedDuration}
                  onChange={(e) =>
                    setUpdatedGuide({
                      ...updatedGuide,
                      estimatedDuration: e.target.value
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., 3-6 months"
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Steps</h4>
              {updatedGuide.steps.map((step, index) => (
                <div key={step.id} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium">Step {index + 1}</h5>
                    <button
                      onClick={() => handleDeleteStep(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) =>
                        handleUpdateStep(index, 'title', e.target.value)
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Step Title"
                    />
                    <textarea
                      value={step.description}
                      onChange={(e) =>
                        handleUpdateStep(index, 'description', e.target.value)
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Step Description"
                      rows={2}
                    />
                    <input
                      type="text"
                      value={step.duration}
                      onChange={(e) =>
                        handleUpdateStep(index, 'duration', e.target.value)
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Duration (e.g., 2-3 weeks)"
                    />
                    <textarea
                      value={step.content}
                      onChange={(e) =>
                        handleUpdateStep(index, 'content', e.target.value)
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Detailed Instructions (optional)"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={handleAddStep}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
              >
                <Plus className="h-4 w-4" />
                Add Step
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSaveChanges}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setUpdatedGuide(guide);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}