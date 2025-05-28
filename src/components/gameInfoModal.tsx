'use client'

import React, { useEffect } from 'react';
import { GameSettings } from '@/types/GameSettings';
import { Difficulty } from '@/types/Difficulty';

interface GameInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameSettingsInput: GameSettings;
  firstOpen?: boolean;
}

const GameInfoModal: React.FC<GameInfoModalProps> = ({ isOpen, onClose, gameSettingsInput, firstOpen = false }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getDifficultyDescription = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case Difficulty.NytHard:
        return "NYT Hard: all correct (green) letters are in the correct position, and all partial (yellow) letters are used.";
      case Difficulty.Hard:
        return "Hard difficulty that all correct (green) letters are in the correct position, all partial (yellow) letters are used, ruled-out (dark grey) letters cannot be reused, and partial (yellow) letters placed in previous positions.";
      case Difficulty.Normal:
      default:
        return "Normal difficulty is the default Wordle experience.";
    }
  };

  const getDifficultyName = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case Difficulty.Normal:
        return "Regular";
      case Difficulty.NytHard:
        return "NYT Hard";
      case Difficulty.Hard:
        return "Really Hard";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Game Information</h2>
        </div>
        
        <div className="p-4 space-y-4">

          <div className="bg-gray-200 p-3 rounded-md">
            <h3 className="font-semibold text-gray-700 mb-2">Difficulty: {getDifficultyName(gameSettingsInput.difficulty)}</h3>
            <p className="text-sm text-gray-600">
              {getDifficultyDescription(gameSettingsInput.difficulty)}
            </p>
          </div>

          <div className="bg-gray-200 p-3 rounded-md">
            <h3 className="font-semibold text-gray-700 mb-2">Par: {gameSettingsInput.par}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>The author thinks you can find the solution in <span className="font-medium">{gameSettingsInput.par}</span> guesses.</p>
            </div>
          </div>
        </div>        
        <div className="p-4 border-t border-gray-200">
          <button 
            className={`w-full py-2 px-4 rounded-md transition-colors font-bold ${
              firstOpen 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            onClick={onClose}
          >
            {firstOpen ? 'Play!' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameInfoModal;