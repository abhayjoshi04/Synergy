import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Guide, TrainingModule } from '../../types/support';
import { standardizationGuides } from '../../data/guides';
import { trainingModules } from '../../data/training';

interface ProgressStats {
  completed: number;
  inProgress: number;
  pending: number;
}

export function ProgressOverview() {
  const [progress, setProgress] = useState<ProgressStats>({
    completed: 0,
    inProgress: 0,
    pending: 2 // Initialize with 2 pending modules (guides and training)
  });

  useEffect(() => {
    // Get guides and training modules from localStorage or use initial data
    const storedGuides = localStorage.getItem('guides');
    const storedTrainingModules = localStorage.getItem('trainingModules');

    // If no stored data, use initial data from our data files
    const guides = storedGuides ? JSON.parse(storedGuides) as Guide[] : standardizationGuides;
    const modules = storedTrainingModules ? JSON.parse(storedTrainingModules) as TrainingModule[] : trainingModules;

    let completed = 0;
    let inProgress = 0;

    // Calculate progress for guides
    const guidesProgress = guides.reduce((acc, guide) => {
      const totalSteps = guide.steps.length;
      const completedSteps = guide.steps.filter(step => step.status === 'completed').length;
      const inProgressSteps = guide.steps.filter(step => step.status === 'in-progress').length;

      if (completedSteps === totalSteps) {
        acc.completed++;
      } else if (completedSteps > 0 || inProgressSteps > 0) {
        acc.inProgress++;
      }
      return acc;
    }, { completed: 0, inProgress: 0 });

    // Calculate progress for training modules
    const modulesProgress = modules.reduce((acc, module) => {
      if (module.completionRate === 100) {
        acc.completed++;
      } else if (module.completionRate > 0) {
        acc.inProgress++;
      }
      return acc;
    }, { completed: 0, inProgress: 0 });

    // Combine progress from both guides and modules
    completed = guidesProgress.completed + modulesProgress.completed;
    inProgress = guidesProgress.inProgress + modulesProgress.inProgress;

    // If there's no activity yet, keep the initial 2 pending
    // Otherwise, calculate pending based on actual progress
    const pending = (!completed && !inProgress) ? 2 : 
                   2 - (completed + inProgress);

    setProgress({
      completed,
      inProgress,
      pending: Math.max(0, pending) // Ensure pending never goes below 0
    });
  }, []); // Empty dependency array means this runs once on mount

  const totalModules = progress.completed + progress.inProgress + progress.pending;
  const completionPercentage = totalModules > 0 
    ? (progress.completed / totalModules) * 100 
    : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-6">Your Progress Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold">{progress.completed}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold">{progress.inProgress}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold">{progress.pending}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${completionPercentage}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}