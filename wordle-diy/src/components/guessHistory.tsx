'use client'
import React from 'react';
import { GuessLetter } from '@/types/GuessLetter';
import { LetterStatus } from '@/types/letterStatus';

interface GuessHistoryProps {
  guessHistory: GuessLetter[][];
}

export default function GuessHistory({ guessHistory }: GuessHistoryProps) {

    const blockSize = 40;

    function getClassName(letterStatus: LetterStatus): string {
        switch (letterStatus) {
            case LetterStatus.NotInAnswer:
                return 'bg-gray-500';
            case LetterStatus.Partial:
                //return 'text-yellow-500';
                return 'bg-yellow-500';
            case LetterStatus.Correct:
                return 'bg-green-500';
            default:
                return '';
        }
    }

  return (
    <div>
      {guessHistory.map((guess, i) => (
      <div className={`grid gap-1 pb-[4px] items-center justify-center mx-auto`}
        key={i}
        style={{
            gridTemplateColumns: `repeat(${guess.length}, minmax(0, 1fr))`, // Dynamically set the number of columns
            maxWidth: `${(blockSize+4)*guess.length}px`, // Ensure it doesn't exceed the container width
        }}
        >
        {guess.map((guessDatum, i) => (
            <div key={i} className={`text-3xl max-h-[40px] text-white text-center aspect-square rounded flex items-center justify-center ${getClassName(guessDatum.status)}`}>
                {guessDatum.letter}
            </div>
        ))}
      </div>
      ))}
    </div>
  );
}