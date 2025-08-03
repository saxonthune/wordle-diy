'use client'

import React from "react";
import Keyboard from "./keyboard";
import { guessIsInWordBank } from "@/services/wordBankValidationService";
import { GameSettings } from "@/types/GameSettings";
import { GuessLetter } from "@/types/GuessLetter";

interface KeyboardGuessProps {
    onSubmit: (guess: string) => void;
    wordLength: number;
    disabled: boolean;
    gameSettings: GameSettings;
    handleDifficultyTipCallback: (guess: string) => boolean;
    clearDifficultyTip: () => void; 
    guessHistory: GuessLetter[][];
    onViewResults?: () => void;
    isAnimating?: boolean;
}

export default function KeyboardGuess({ onSubmit, wordLength, disabled, gameSettings,
    handleDifficultyTipCallback, clearDifficultyTip, guessHistory, onViewResults, isAnimating = false }: KeyboardGuessProps) {

    const [guess, setGuess] = React.useState("");
    const [canSubmit, setCanSubmit] = React.useState(false);
    const [textClass, setTextClass] = React.useState("");

    const validTextClass = "";
    const invalidTextClass = "text-red-500";
    
    React.useEffect(() => {
        if (disabled && !isAnimating) {
            setGuess("Well done!");
        } else if (!disabled || isAnimating) {
            setGuess("");
        }
    }
    , [disabled, isAnimating]);
    
    const handleDictionaryLookup = (guess: string) => {
        if (gameSettings.useDictionary && guessIsInWordBank(guess) === false) {
            return false;
        }
        return true;
    };

    const handleButtonClick = (key: string) => {
        if (disabled || isAnimating) 
            return;
        setTextClass(validTextClass)

        switch (key) {
            case "back":
                setCanSubmit(false);
                setGuess(guess.slice(0, -1));
                clearDifficultyTip();
                break;
            case "enter":
                if (canSubmit) {
                    onSubmit(guess);
                    setGuess("");
                    setCanSubmit(false);
                    clearDifficultyTip();
                }
                break;
            default:
                if (guess.length < wordLength) {
                    if (guess.length + 1 === wordLength) {
                        if (handleDifficultyTipCallback(guess + key) && 
                        (handleDictionaryLookup(guess + key) !== false)) {
                            clearDifficultyTip();
                            setCanSubmit(true);
                        }
                        else {
                            setTextClass(invalidTextClass);
                        }
                    }
                    setGuess(guess + key);
                }
                break;
        }
    };
    
    return (
        <div className="flex flex-col items-center gap-1">
            {disabled && !isAnimating ? (
                <div className="flex items-center gap-3 text-2xl min-h-[28px]">
                    <span className={textClass}>Well done!</span>
                    {onViewResults && (
                        <button
                            onClick={onViewResults}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-bold"
                        >
                            View Results
                        </button>
                    )}
                </div>
            ) : (
                <div className={`text-2xl min-h-[28px] ${textClass}`}>{guess}</div>
            )}
            <Keyboard 
                onKeyPress={handleButtonClick} 
                canSubmit={canSubmit} 
                gameComplete={disabled && !isAnimating}
                guessHistory={guessHistory}
            />
        </div>
    );
}


