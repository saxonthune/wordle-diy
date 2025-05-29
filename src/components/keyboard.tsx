'use client'

import React, { useEffect, useMemo } from 'react';
import { LetterStatus } from '@/types/letterStatus';
import { GuessLetter } from '@/types/GuessLetter';

interface KeyboardProps {
    onKeyPress: (key: string) => void;
    canSubmit: boolean;
    gameComplete: boolean;
    guessHistory: GuessLetter[][];
}

export default function Keyboard({ onKeyPress: onKeyboardInput, canSubmit, gameComplete, guessHistory }: KeyboardProps) {

    const letterStatuses = useMemo(() => {
        const statuses = new Map<string, LetterStatus>();

        for (const guess of guessHistory) {
            for (const guessLetter of guess) {
                const currentStatus = statuses.get(guessLetter.letter);
                
                // Priority: Correct > Partial > NotInAnswer
                if (!currentStatus || 
                    (guessLetter.status === LetterStatus.Correct) ||
                    (guessLetter.status === LetterStatus.Partial && currentStatus !== LetterStatus.Correct)) {
                    statuses.set(guessLetter.letter, guessLetter.status);
                }
            }
        }

        return statuses;
    }, [guessHistory]);

    const handleButtonClick = (key: string) => {
        onKeyboardInput(key);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toUpperCase();

            if (key === "ENTER") {
                onKeyboardInput('enter');
            } 
            else if (key === "BACKSPACE") {
                onKeyboardInput('back');
            }
            else if (key.length === 1 && /^[A-Z]$/.test(key)) {
                onKeyboardInput(key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onKeyboardInput]);

    const displayEnter = () => {
        if (gameComplete) {
        return "😎";
        }
        return canSubmit ? "🚀" : "⛔";
    };

    const submitBackButtonClass = "text-[clamp(0.75rem, 2vw, 1.5rem)]";

    const getButtonClass = (key: string): string => {
        const status = letterStatuses.get(key) || LetterStatus.NotGuessed;
        const baseClass = "rounded min-w-[28px] text-[clamp(0.75rem, 2vw, 1.5rem)]";

        switch (status) {
            case LetterStatus.Correct:
                return baseClass + " bg-green-500";
            case LetterStatus.Partial:
                return baseClass + " bg-yellow-500";
            case LetterStatus.NotInAnswer:
                return baseClass + " bg-gray-600";
            case LetterStatus.NotGuessed:
            default:
                return baseClass + " bg-gray-400";
        }
    }


    return (
        <div className="text-2xl text-white">
        <div className="grid grid-cols-10 gap-2 pb-2">
            <button className={getButtonClass('Q')} onClick={() => handleButtonClick('Q')}>Q</button>
            <button className={getButtonClass('W')} onClick={() => handleButtonClick('W')}>W</button>
            <button className={getButtonClass('E')} onClick={() => handleButtonClick('E')}>E</button>
            <button className={getButtonClass('R')} onClick={() => handleButtonClick('R')}>R</button>
            <button className={getButtonClass('T')} onClick={() => handleButtonClick('T')}>T</button>
            <button className={getButtonClass('Y')} onClick={() => handleButtonClick('Y')}>Y</button>
            <button className={getButtonClass('U')} onClick={() => handleButtonClick('U')}>U</button>
            <button className={getButtonClass('I')} onClick={() => handleButtonClick('I')}>I</button>
            <button className={getButtonClass('O')} onClick={() => handleButtonClick('O')}>O</button>
            <button className={getButtonClass('P')} onClick={() => handleButtonClick('P')}>P</button>
        </div>
        <div className="grid grid-cols-9 gap-2 pb-2">
            <button className={getButtonClass('A')} onClick={() => handleButtonClick('A')}>A</button>
            <button className={getButtonClass('S')} onClick={() => handleButtonClick('S')}>S</button>
            <button className={getButtonClass('D')} onClick={() => handleButtonClick('D')}>D</button>
            <button className={getButtonClass('F')} onClick={() => handleButtonClick('F')}>F</button>
            <button className={getButtonClass('G')} onClick={() => handleButtonClick('G')}>G</button>
            <button className={getButtonClass('H')} onClick={() => handleButtonClick('H')}>H</button>
            <button className={getButtonClass('J')} onClick={() => handleButtonClick('J')}>J</button>
            <button className={getButtonClass('K')} onClick={() => handleButtonClick('K')}>K</button>
            <button className={getButtonClass('L')} onClick={() => handleButtonClick('L')}>L</button>
        </div>
        <div className="grid grid-cols-9 gap-2">
            <button className={submitBackButtonClass} onClick={() => handleButtonClick('enter')}>{displayEnter()}</button>
            <button className={getButtonClass('Z')} onClick={() => handleButtonClick('Z')}>Z</button>
            <button className={getButtonClass('X')} onClick={() => handleButtonClick('X')}>X</button>
            <button className={getButtonClass('C')} onClick={() => handleButtonClick('C')}>C</button>
            <button className={getButtonClass('V')} onClick={() => handleButtonClick('V')}>V</button>
            <button className={getButtonClass('B')} onClick={() => handleButtonClick('B')}>B</button>
            <button className={getButtonClass('N')} onClick={() => handleButtonClick('N')}>N</button>
            <button className={getButtonClass('M')} onClick={() => handleButtonClick('M')}>M</button>
            <button className={submitBackButtonClass} onClick={() => handleButtonClick('back')}>🔙</button>
        </div>
        </div>
    );
}