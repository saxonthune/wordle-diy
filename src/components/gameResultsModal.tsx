'use client'

import React, { useEffect, useState } from 'react';
import { GuessLetter } from '@/types/GuessLetter';
import { LetterStatus } from '@/types/letterStatus';
import { GameSettings } from '@/types/GameSettings';

interface GameResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  guessHistory: GuessLetter[][];
  gameSettings: GameSettings;
}

const GameResultsModal: React.FC<GameResultsModalProps> = ({ 
  isOpen, 
  onClose, 
  guessHistory,
  gameSettings 
}) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy Link');

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

  const getEmojiForLetter = (letter: GuessLetter): string => {
    switch (letter.status) {
      case LetterStatus.Correct:
        return '🟩';
      case LetterStatus.Partial:
        return '🟨';
      case LetterStatus.NotInAnswer:
        return '⬛';
      default:
        return '⬜';
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyButtonText('Copied!');
      setTimeout(() => {
        setCopyButtonText('Copy Link');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopyButtonText('Failed to copy');
      setTimeout(() => {
        setCopyButtonText('Copy Link');
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] shadow-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 justify-center flex-shrink-0">
          <h2 className="text-2xl font-semibold text-gray-800">🎉 Puzzle Complete!</h2>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          <div className="bg-gray-100 rounded-md">
            <div className="text-center mb-4">
              <p className="text-xl text-gray-600 mt-2 p-2">
                Made by: <span className="font-semibold">{gameSettings.author || 'Anonymous'}</span>
              </p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-3 text-center">Results</h3>
            <div className="space-y-2">
              {guessHistory.map((guess, index) => (
                <div key={index} className="flex justify-center space-x-1">
                  {guess.map((letter, letterIndex) => (
                    <span key={letterIndex} className="text-2xl">
                      {getEmojiForLetter(letter)}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex gap-3">
            <button 
              className="flex-1 py-2 px-4 rounded-md transition-colors font-bold bg-blue-500 text-white hover:bg-blue-600"
              onClick={handleCopyLink}
            >
              {copyButtonText}
            </button>
            <button 
              className="flex-1 py-2 px-4 rounded-md transition-colors font-bold bg-green-500 text-white hover:bg-green-600"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResultsModal;
