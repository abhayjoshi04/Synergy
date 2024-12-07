import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { GuideDetails } from './GuideDetails';
import { standardizationGuides } from '../../../data/guides';

interface GuidesListProps {
  onBack: () => void;
}

export function GuidesList() {
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [guides, setGuides] = useState(standardizationGuides);
  const [newGuide, setNewGuide] = useState({ title: '', description: '', category: '', estimatedDuration: '', steps: [] });
  const [isAddingGuide, setIsAddingGuide] = useState(false); // State to control visibility of add guide form

  const selectedGuide = guides.find((g) => g.id === selectedGuideId);

  const handleAddGuide = () => {
    if (newGuide.title && newGuide.description) {
      setGuides([
        ...guides,
        {
          ...newGuide,
          id: `${Date.now()}`,
          steps: [],
        },
      ]);
      setNewGuide({ title: '', description: '', category: '', estimatedDuration: '', steps: [] });
      setIsAddingGuide(false); // Hide the form after adding the guide
    }
  };

  // Handle deleting a guide
  const handleDeleteGuide = (guideId: string) => {
    setGuides((prevGuides) => prevGuides.filter((guide) => guide.id !== guideId));
    setSelectedGuideId(null); // Reset selected guide
  };

  if (selectedGuide) {
    return (
      <GuideDetails
        guide={selectedGuide}
        onBack={() => setSelectedGuideId(null)}
        onUpdateGuide={(updatedGuide) =>
          setGuides(guides.map((g) => (g.id === updatedGuide.id ? updatedGuide : g)))
        }
        onDeleteGuide={handleDeleteGuide} // Pass delete handler to GuideDetails
      />
    );
  }

  return (
    <div className="space-y-6">
      <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800">
        <ArrowLeft className="h-4 w-4" />
        Back to Overview
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide) => (
          <button
            key={guide.id}
            onClick={() => setSelectedGuideId(guide.id)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{guide.title}</h3>
              <ChevronRight className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-indigo-600">{guide.estimatedDuration}</span>
              <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                {guide.steps.length} steps
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Add Guide Button */}
      {!isAddingGuide && (
        <button
          onClick={() => setIsAddingGuide(true)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
        >
          <PlusCircle className="h-5 w-5" />
          Add Guide
        </button>
      )}

      {/* Add Guide Form */}
      {isAddingGuide && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Add New Guide</h3>
          <input
            type="text"
            placeholder="Title"
            value={newGuide.title}
            onChange={(e) => setNewGuide({ ...newGuide, title: e.target.value })}
            className="block w-full mb-2 p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={newGuide.description}
            onChange={(e) => setNewGuide({ ...newGuide, description: e.target.value })}
            className="block w-full mb-2 p-2 border rounded"
          />
          <textarea
            placeholder="Category"
            value={newGuide.category}
            onChange={(e) => setNewGuide({ ...newGuide, category: e.target.value })}
            className="block w-full mb-2 p-2 border rounded"
          />
          <div className="flex gap-4">
            <button
              onClick={handleAddGuide}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save Guide
            </button>
            <button
              onClick={() => setIsAddingGuide(false)}
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
