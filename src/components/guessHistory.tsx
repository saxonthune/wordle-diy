'use client'
import React from 'react';
import { GuessLetter } from '@/types/GuessLetter';
import { LetterStatus } from '@/types/letterStatus';
import { BLOCK_SIZE } from '@/constants/constants';

interface GuessHistoryProps {
  guessHistory: GuessLetter[][];
  isAnimating?: boolean;
  animatingGuessIndex?: number;
  animatingLetterIndex?: number;
}

export default function GuessHistory({ guessHistory, isAnimating = false, animatingGuessIndex, animatingLetterIndex = -1 }: GuessHistoryProps) {

    function getClassName(letterStatus: LetterStatus, isCurrentlyAnimating: boolean = false): string {
        const baseClass = (() => {
            switch (letterStatus) {
                case LetterStatus.NotInAnswer:
                    return 'bg-gray-500';
                case LetterStatus.Partial:
                    return 'bg-yellow-500';
                case LetterStatus.Correct:
                    return 'bg-green-500';
                default:
                    return '';
            }
        })();
        
        return isCurrentlyAnimating ? `${baseClass} animate-bounce` : baseClass;
    }

  return (
    <div>
      {guessHistory.map((guess, i) => (
      <div className={`grid gap-1 pb-[4px] items-center justify-center mx-auto`}
        key={i}
        style={{
            gridTemplateColumns: `repeat(${guess.length}, minmax(0, 1fr))`, 
            maxWidth: `${(BLOCK_SIZE+4)*guess.length}px`, 
        }}
        >
        {guess.map((guessDatum, letterIndex) => {
            const isWinningGuess = animatingGuessIndex === i;
            const isLetterRevealed = !isWinningGuess || !isAnimating || letterIndex <= animatingLetterIndex;
            const isCurrentlyAnimating = isWinningGuess && isAnimating && letterIndex === animatingLetterIndex;
            
            return (
                <div key={letterIndex} className={`text-3xl max-h-[40px] text-white text-center aspect-square rounded flex items-center justify-center ${
                    isLetterRevealed ? getClassName(guessDatum.status, isCurrentlyAnimating) : 'bg-gray-300'
                }`}>
                    {isLetterRevealed ? guessDatum.letter : ''}
                </div>
            );
        })}
      </div>
      ))}
    </div>
  );
}