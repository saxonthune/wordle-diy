'use client'

import React from "react";
import Keyboard from "./keyboard";
import { guessIsInWordBank } from "@/services/wordBankValidationService";
import { GameSettings } from "@/types/GameSettings";
import { difficultyValidationService } from "@/services/difficultyValidationService";

interface KeyboardGuessProps {
    onSubmit: (guess: string) => void;
    wordLength: number;
    disabled: boolean;
    gameSettings: GameSettings;
    handleDifficultyTipCallback: (guess: string) => boolean;
}

export default function KeyboardGuess({ onSubmit, wordLength, disabled, gameSettings, handleDifficultyTipCallback }: KeyboardGuessProps) {

    const [guess, setGuess] = React.useState("");
    const [canSubmit, setCanSubmit] = React.useState(false);

    const handleButtonClick = (key: string) => {
        if (disabled) 
            return;

        switch (key) {
            case "back":
                setCanSubmit(false);
                setGuess(guess.slice(0, -1));
                break;
            case "enter":
                console.log("canSubmit", canSubmit);
                console.log("isInWordBank", guessIsInWordBank(guess));
                if (canSubmit) {
                    onSubmit(guess);
                    setGuess("");
                    setCanSubmit(false);
                }
                break;
            default:
                if (guess.length < wordLength) {
                    if (guess.length + 1 === wordLength) {
                        if (handleDifficultyTipCallback(guess + key) && 
                        (guessIsInWordBank(guess + key) !== false)) {
                            setCanSubmit(true);
                        }
                    }
                    setGuess(guess + key);
                }
                break;
        }
    };
    
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="min-h-[28px]">{guess}</div>
            <Keyboard onKeyPress={handleButtonClick} canSubmit={canSubmit} />
        </div>

    );
}


