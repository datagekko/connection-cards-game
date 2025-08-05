import * as React from 'react';

interface ExitIntentModalProps {
  show: boolean;
  onClose: () => void;
}

const ExitIntentModal: React.FC<ExitIntentModalProps> = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center shadow-lg transform transition-all duration-300 scale-100">
        <h2 className="text-3xl font-bold text-white mb-3">Wait, don't go!</h2>
        <p className="text-slate-300 mb-6">
          Enjoying the game? Dig deeper with journaling to reflect and understand yourself.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://myjournalto.com/products/guided-journal"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            Discover Journaling
          </a>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 transition-colors"
          >
            Continue Playing
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentModal; 