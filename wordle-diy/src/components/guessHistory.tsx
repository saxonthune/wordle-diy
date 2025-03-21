'use client'
import React from 'react';
import { GuessLetter } from '@/types/GuessLetter';
import { LetterStatus } from '@/types/letterStatus';

interface GuessHistoryProps {
  guessHistory: GuessLetter[][];
}

export default function GuessHistory({ guessHistory }: GuessHistoryProps) {

    function getClassName(letterStatus: LetterStatus): string {
        switch (letterStatus) {
            case LetterStatus.NotInAnswer:
                return 'text-gray-500';
            case LetterStatus.Partial:
                return 'text-yellow-500';
            case LetterStatus.Correct:
                return 'text-green-500';
            default:
                return '';
        }
    }

  return (
    <div className="text-center">
      {guessHistory.map((guess, i) => (
      <div className="grid grid-cols-5 gap-2" key={i}>
        {guess.map((guessDatum, i) => (
            <div key={i} className= {getClassName(guessDatum.status)}>
                {guessDatum.letter}
            </div>
        ))}
      </div>
      ))}
    </div>
  );
}