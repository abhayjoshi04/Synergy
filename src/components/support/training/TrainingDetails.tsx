import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle, Clock, Edit, Trash2 } from 'lucide-react';
import { TrainingModule } from '../../../types/support';
import { VideoPlayer } from './VideoPlayer';
import { motion } from 'framer-motion';

interface TrainingDetailsProps {
  module: TrainingModule;
  onBack: () => void;
  onUpdateModule: (module: TrainingModule) => void;
  onDeleteModule: (moduleId: string) => void;
  updateProgress: (completedCount: number) => void;
  completedTopics: string[];
  onTopicComplete: (topicId: string) => void;
}

export function TrainingDetails({
  module,
  onBack,
  onUpdateModule,
  onDeleteModule,
  updateProgress,
  completedTopics,
  onTopicComplete,
}: TrainingDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedModule, setEditedModule] = useState(module);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const initialProgress = module.topics.reduce((acc, topic) => {
      acc[topic.id] = completedTopics.includes(topic.id) ? 100 : 0;
      return acc;
    }, {} as { [key: string]: number });
    setVideoProgress(initialProgress);
  }, [module.topics, completedTopics]);

  const handleSaveChanges = () => {
    onUpdateModule(editedModule);
    setIsEditing(false);
  };

  const handleVideoProgress = (topicId: string, progress: number) => {
    setVideoProgress(prev => ({
      ...prev,
      [topicId]: progress,
    }));

    if (progress >= 95 && !completedTopics.includes(topicId)) {
      handleVideoComplete(topicId);
    }
  };

  const handleVideoComplete = (topicId: string) => {
    if (!completedTopics.includes(topicId)) {
      onTopicComplete(topicId);
      const newCompletedCount = completedTopics.length + 1;
      updateProgress(newCompletedCount);

      const completionRate = Math.round((newCompletedCount / module.topics.length) * 100);
      onUpdateModule({
        ...module,
        completionRate,
      });
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Training Modules
      </button>

      <div className="bg-white rounded-lg p-6 shadow-md">
        {!isEditing ? (
          <div>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{module.title}</h2>
                <p className="text-gray-600">{module.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
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

            <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Duration: {module.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>{completedTopics.length} of {module.topics.length} completed</span>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Course Content</h3>
              <div className="space-y-4">
                {module.topics.map((topic, index) => (
                  <div
                    key={topic.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <button
                      onClick={() => setSelectedVideo(topic.videoId)}
                      className="flex items-center gap-4 flex-1"
                    >
                      <Play className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <div className="text-left flex-1">
                        <h4 className="font-medium">Topic {index + 1}</h4>
                        <p className="text-sm text-gray-600">{topic.title}</p>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${videoProgress[topic.id] || 0}%` }}
                          />
                        </div>
                      </div>
                    </button>
                    {completedTopics.includes(topic.id) && (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50"
                >
                  <Edit className="h-4 w-4" />
                  Edit Module
                </button>
                <button
                  onClick={() => onDeleteModule(module.id)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Module
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-4">Edit Module</h3>
            <div className="space-y-4">
              {/* Add form inputs for editing module */}
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedVideo && (
        <VideoPlayer
          videoId={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          onComplete={() => {
            const topic = module.topics.find((t) => t.videoId === selectedVideo);
            if (topic) handleVideoComplete(topic.id);
            setSelectedVideo(null);
          }}
          onProgress={(progress) => {
            const topic = module.topics.find((t) => t.videoId === selectedVideo);
            if (topic) handleVideoProgress(topic.id, progress);
          }}
        />
      )}
    </div>
  );
}
