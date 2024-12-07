import React, { createContext, useState, useContext, ReactNode } from 'react';
import { trainingModules as initialTrainingModules, TrainingModule } from '../data/training';

interface TrainingContextProps {
  trainingModules: TrainingModule[];
  toggleTaskCompletion: (moduleId: string, taskId: string) => void;
}

const TrainingContext = createContext<TrainingContextProps | undefined>(undefined);

export function TrainingProvider({ children }: { children: ReactNode }) {
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>(initialTrainingModules);

  const toggleTaskCompletion = (moduleId: string, taskId: string) => {
    setTrainingModules((prevModules) =>
      prevModules.map((module) => {
        if (module.id !== moduleId) return module;
        return {
          ...module,
          tasks: module.tasks.map((task) =>
            task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
          ),
        };
      })
    );
  };

  return (
    <TrainingContext.Provider value={{ trainingModules, toggleTaskCompletion }}>
      {children}
    </TrainingContext.Provider>
  );
}

export function useTraining() {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
}
