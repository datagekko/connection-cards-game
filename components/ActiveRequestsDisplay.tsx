import React from 'react';
import { PlayerRequest, Player } from '../types';
import { TOPIC_EMOJIS } from '../constants';

interface ActiveRequestsDisplayProps {
  requests: PlayerRequest[];
  players: Player[];
  onFulfillRequest?: (requestId: string) => void;
}

const ActiveRequestsDisplay: React.FC<ActiveRequestsDisplayProps> = ({ 
  requests, 
  players, 
  onFulfillRequest 
}) => {
  if (requests.length === 0) return null;

  const getPlayerName = (playerId: number) => {
    return players.find(p => p.id === playerId)?.name || 'Unknown Player';
  };

  const formatTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / (1000 * 60));
    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 min ago';
    return `${minutes} mins ago`;
  };

  return (
    <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg p-4 border border-pink-500/20">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-white flex items-center">
          <span className="text-pink-400 mr-2">💫</span>
          Active Requests ({requests.length})
        </h4>
      </div>
      
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {requests.map((request) => (
          <div 
            key={request.id}
            className="flex items-center justify-between bg-black/20 rounded-lg p-3 text-sm"
          >
            <div className="flex items-center space-x-3 flex-1">
              <span className="text-lg">{TOPIC_EMOJIS[request.topic]}</span>
              <div className="flex-1">
                <div className="text-white font-medium">
                  {getPlayerName(request.playerId)} wants to be asked about {request.topic}
                </div>
                {request.specificPrompt && (
                  <div className="text-gray-300 text-xs mt-1 italic">
                    "{request.specificPrompt}"
                  </div>
                )}
                <div className="text-gray-400 text-xs mt-1">
                  {formatTimeAgo(request.createdAt)}
                </div>
              </div>
            </div>
            
            {onFulfillRequest && (
              <button
                onClick={() => onFulfillRequest(request.id)}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
              >
                Ask Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveRequestsDisplay;