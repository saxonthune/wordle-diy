'use client'

import React from "react";
import Keyboard from "./keyboard";
import { guessIsInWordBank } from "@/services/wordBankValidationService";
import { GameSettings } from "@/types/GameSettings";

interface KeyboardGuessProps {
    onSubmit: (guess: string) => void;
    wordLength: number;
    disabled: boolean;
    gameSettings: GameSettings;
    handleDifficultyTipCallback: (guess: string) => boolean;
    clearDifficultyTip: () => void; 
}

export default function KeyboardGuess({ onSubmit, wordLength, disabled, 
    handleDifficultyTipCallback, clearDifficultyTip }: KeyboardGuessProps) {

    const [guess, setGuess] = React.useState("");
    const [canSubmit, setCanSubmit] = React.useState(false);
    const [textClass, setTextClass] = React.useState("");

    const validTextClass = "";
    const invalidTextClass = "text-red-500";
    
    React.useEffect(() => {
        if (disabled) {
            setGuess("Well done!");
        }
    }
    , [disabled]);

    const handleButtonClick = (key: string) => {
        if (disabled) 
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
                        (guessIsInWordBank(guess + key) !== false)) {
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
            <div className={`text-2xl min-h-[28px] ${textClass}`}>{guess}</div>
            <Keyboard onKeyPress={handleButtonClick} canSubmit={canSubmit} gameComplete={disabled}/>
        </div>

    );
}


