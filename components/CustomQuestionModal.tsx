import React, { useState } from 'react';
import { CustomQuestion, Player, SessionMood, GameMode, QuestionType, RelationshipType } from '../types';

interface CustomQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: Omit<CustomQuestion, 'id' | 'createdAt'>) => void;
  currentPlayer: Player;
}

const CustomQuestionModal: React.FC<CustomQuestionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  currentPlayer 
}) => {
  const [questionText, setQuestionText] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<SessionMood[]>([SessionMood.Chill]);
  const [intimacyLevel, setIntimacyLevel] = useState(5);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (questionText.trim().length < 10) {
      alert('Question must be at least 10 characters long');
      return;
    }

    onSubmit({
      text: questionText.trim(),
      mode: GameMode.GroupMode,
      type: QuestionType.Question,
      moodTags: selectedMoods,
      intimacyLevel,
      appropriateRelationships: [RelationshipType.BestFriends], // Default for group mode
      authorId: currentPlayer.id,
      approved: true // Auto-approve for group sessions
    });

    // Reset form
    setQuestionText('');
    setSelectedMoods([SessionMood.Chill]);
    setIntimacyLevel(5);
    onClose();
  };

  const toggleMood = (mood: SessionMood) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  const getMoodColor = (mood: SessionMood) => {
    switch (mood) {
      case SessionMood.Chill: return 'from-blue-500 to-cyan-400';
      case SessionMood.Deep: return 'from-purple-600 to-indigo-500';
      case SessionMood.Wild: return 'from-red-500 to-orange-400';
      case SessionMood.Funny: return 'from-yellow-500 to-pink-400';
    }
  };

  const getMoodEmoji = (mood: SessionMood) => {
    switch (mood) {
      case SessionMood.Chill: return '😌';
      case SessionMood.Deep: return '🤔';
      case SessionMood.Wild: return '🔥';
      case SessionMood.Funny: return '😂';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Add Custom Question</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Question
            </label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="What's something you've never told anyone?"
              className="w-full h-24 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              required
              minLength={10}
              maxLength={200}
            />
            <div className="text-xs text-gray-400 mt-1">
              {questionText.length}/200 characters
            </div>
          </div>

          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Which moods fit this question? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(SessionMood).map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => toggleMood(mood)}
                  className={`
                    p-3 rounded-lg border-2 transition-all text-sm font-medium
                    ${selectedMoods.includes(mood)
                      ? `bg-gradient-to-r ${getMoodColor(mood)} border-white text-white`
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                    }
                  `}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>{getMoodEmoji(mood)}</span>
                    <span>{mood}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Intimacy Level */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Intimacy Level: {intimacyLevel}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={intimacyLevel}
              onChange={(e) => setIntimacyLevel(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Light</span>
              <span>Personal</span>
              <span>Intimate</span>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={questionText.trim().length < 10 || selectedMoods.length === 0}
              className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomQuestionModal;