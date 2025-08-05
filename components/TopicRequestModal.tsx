import React, { useState } from 'react';
import { PlayerRequest, Player, RequestTopic } from '../types';
import { TOPIC_EMOJIS } from '../constants';

interface TopicRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Omit<PlayerRequest, 'id' | 'createdAt' | 'fulfilled'>) => void;
  currentPlayer: Player;
}

const getTopicDescription = (topic: RequestTopic): string => {
  switch (topic) {
    case RequestTopic.Love:
      return 'Questions about relationships, dating, and romance';
    case RequestTopic.Career:
      return 'Work, ambitions, and professional goals';
    case RequestTopic.Family:
      return 'Family dynamics, childhood, and home life';
    case RequestTopic.Dreams:
      return 'Aspirations, hopes, and future plans';
    case RequestTopic.Fears:
      return 'Worries, insecurities, and things that scare you';
    case RequestTopic.Fun:
      return 'Hobbies, entertainment, and favorite things';
    case RequestTopic.Deep:
      return 'Philosophy, beliefs, and meaningful topics';
    case RequestTopic.Secrets:
      return 'Hidden truths and personal confessions';
  }
};

const TopicRequestModal: React.FC<TopicRequestModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  currentPlayer 
}) => {
  const [selectedTopic, setSelectedTopic] = useState<RequestTopic | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTopic) {
      alert('Please select a topic');
      return;
    }

    onSubmit({
      playerId: currentPlayer.id,
      topic: selectedTopic,
      specificPrompt: customPrompt.trim() || undefined
    });

    // Reset form
    setSelectedTopic(null);
    setCustomPrompt('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl max-w-lg w-full p-6 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            What do you dare them to ask you about?
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Topic Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Choose a topic that interests you:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(RequestTopic).map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  className={`
                    p-4 rounded-lg border-2 transition-all text-left
                    ${selectedTopic === topic
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-white shadow-lg'
                      : 'bg-gray-700 border-gray-600 hover:border-gray-500 hover:bg-gray-600'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl flex-shrink-0">
                      {TOPIC_EMOJIS[topic]}
                    </span>
                    <div>
                      <div className="font-medium text-white text-sm">
                        {topic}
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        {getTopicDescription(topic)}
                      </div>
                    </div>
                  </div>
                  {selectedTopic === topic && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt */}
          {selectedTopic && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Optional: Add a specific prompt or context
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={`e.g., "Ask me about my biggest regret in ${selectedTopic.toLowerCase()}"`}
                className="w-full h-20 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                maxLength={150}
              />
              <div className="text-xs text-gray-400 mt-1">
                {customPrompt.length}/150 characters
              </div>
            </div>
          )}

          {/* Player Info */}
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-300">
              Request from: <span className="font-medium text-white">{currentPlayer.name}</span>
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
              disabled={!selectedTopic}
              className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopicRequestModal;