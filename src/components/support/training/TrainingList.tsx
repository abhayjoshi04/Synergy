import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { TrainingDetails } from './TrainingDetails';
import { TrainingModule } from '../../../types/support';

const initialModules: TrainingModule[] = [
  {
    id: 'module-1',
    title: 'Understanding School Standardization',
    description: 'Introduction to school standardization principles and requirements.',
    topics: [
      {
        id: 'topic-1',
        title: 'Basic standardization concepts',
        videoId: 'dQw4w9WgXcQ'
      },
      {
        id: 'topic-2',
        title: 'UDISE+ requirements',
        videoId: 'dQw4w9WgXcQ'
      },
      {
        id: 'topic-3',
        title: 'Compliance guidelines',
        videoId: 'dQw4w9WgXcQ'
      }
    ],
    duration: '2 hours',
    level: 'basic',
    completionRate: 0
  },
  {
    id: 'module-2',
    title: 'Change Management for School Leaders',
    description: 'Managing transition and stakeholder engagement during standardization.',
    topics: [
      {
        id: 'topic-4',
        title: 'Stakeholder communication',
        videoId: 'dQw4w9WgXcQ'
      },
      {
        id: 'topic-5',
        title: 'Resistance management',
        videoId: 'dQw4w9WgXcQ'
      },
      {
        id: 'topic-6',
        title: 'Implementation strategies',
        videoId: 'dQw4w9WgXcQ'
      }
    ],
    duration: '4 hours',
    level: 'intermediate',
    completionRate: 0
  }
];

export function TrainingList() {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [modules, setModules] = useState(initialModules);
  const [completedTopics, setCompletedTopics] = useState<{ [key: string]: string[] }>({});
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    duration: '',
    level: 'basic' as const,
    topics: [] as { id: string; title: string; videoId: string }[]
  });

  const selectedModule = modules.find((m) => m.id === selectedModuleId);

  const handleAddModule = () => {
    if (newModule.title && newModule.description) {
      const moduleId = `module-${Date.now()}`;
      setModules([
        ...modules,
        {
          ...newModule,
          id: moduleId,
          completionRate: 0,
          topics: newModule.topics.length > 0 ? newModule.topics : []
        }
      ]);
      setNewModule({
        title: '',
        description: '',
        duration: '',
        level: 'basic',
        topics: []
      });
      setIsAddingModule(false);
    }
  };

  const handleDeleteModule = (moduleId: string) => {
    setModules((prevModules) =>
      prevModules.filter((module) => module.id !== moduleId)
    );
    setSelectedModuleId(null);
  };

  const handleTopicComplete = (moduleId: string, topicId: string) => {
    setCompletedTopics((prev) => ({
      ...prev,
      [moduleId]: [...(prev[moduleId] || []), topicId]
    }));
  };

  const updateModuleProgress = (moduleId: string, completedCount: number) => {
    setModules((prevModules) =>
      prevModules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              completionRate: Math.round((completedCount / m.topics.length) * 100)
            }
          : m
      )
    );
  };

  if (selectedModule) {
    return (
      <TrainingDetails
        module={selectedModule}
        onBack={() => setSelectedModuleId(null)}
        onUpdateModule={(updatedModule) =>
          setModules(modules.map((m) =>
            m.id === updatedModule.id ? updatedModule : m
          ))
        }
        onDeleteModule={handleDeleteModule}
        updateProgress={(completedCount) =>
          updateModuleProgress(selectedModule.id, completedCount)
        }
        completedTopics={completedTopics[selectedModule.id] || []}
        onTopicComplete={(topicId) =>
          handleTopicComplete(selectedModule.id, topicId)
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800">
        <ArrowLeft className="h-4 w-4" />
        Back to Overview
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((module) => (
          <button
            key={module.id}
            onClick={() => setSelectedModuleId(module.id)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{module.title}</h3>
              <ChevronRight className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-gray-600 text-sm mb-4">{module.description}</p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">{module.duration}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Level</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    module.level === 'basic'
                      ? 'bg-green-100 text-green-800'
                      : module.level === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {module.level}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span>{module.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${module.completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {!isAddingModule ? (
        <button
          onClick={() => setIsAddingModule(true)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
        >
          <PlusCircle className="h-5 w-5" />
          Add Training Module
        </button>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Add New Training Module</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={newModule.title}
              onChange={(e) =>
                setNewModule({ ...newModule, title: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={newModule.description}
              onChange={(e) =>
                setNewModule({ ...newModule, description: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
            <input
              type="text"
              placeholder="Duration (e.g., 2 hours)"
              value={newModule.duration}
              onChange={(e) =>
                setNewModule({ ...newModule, duration: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
            <select
              value={newModule.level}
              onChange={(e) =>
                setNewModule({
                  ...newModule,
                  level: e.target.value as 'basic' | 'intermediate' | 'advanced'
                })
              }
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <div>
              <h4 className="font-medium mb-2">Topics</h4>
              {newModule.topics.map((topic, index) => (
                <div key={index} className="mb-4">
                  <input
                    type="text"
                    value={topic.title}
                    onChange={(e) => {
                      const newTopics = [...newModule.topics];
                      newTopics[index] = {
                        ...topic,
                        title: e.target.value
                      };
                      setNewModule({ ...newModule, topics: newTopics });
                    }}
                    className="w-full px-4 py-2 border rounded-lg mb-2"
                    placeholder="Topic Title"
                  />
                  <input
                    type="text"
                    value={topic.videoId}
                    onChange={(e) => {
                      const newTopics = [...newModule.topics];
                      newTopics[index] = {
                        ...topic,
                        videoId: e.target.value
                      };
                      setNewModule({ ...newModule, topics: newTopics });
                    }}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="YouTube Video ID"
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  setNewModule({
                    ...newModule,
                    topics: [
                      ...newModule.topics,
                      { id: `topic-${Date.now()}`, title: '', videoId: '' }
                    ]
                  })
                }
                className="text-indigo-600 hover:text-indigo-800"
              >
                + Add Topic
              </button>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddModule}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save Module
            </button>
            <button
              onClick={() => setIsAddingModule(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}