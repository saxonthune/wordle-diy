'use client'
import React from 'react';
import KeyboardGuess from './keyboardGuess';
import GuessHistory from './guessHistory';
import { gradeGuess } from '../services/guessService';
import { LetterStatus } from '@/types/letterStatus';
import { GuessLetter } from '@/types/GuessLetter';
import { GameSettings } from '../types/GameSettings';
import StatusHeader from './statusHeader';
import { urlService } from '@/services/urlService';
import { difficultyValidationService } from '@/services/difficultyValidationService';
import { DifficultyRule } from '@/types/DifficultyRule';
import DifficultyTip from './difficultyTip';

interface GameContainerProps {
    gameSettingsInput: GameSettings;
}

export default function GameContainer( { gameSettingsInput }: GameContainerProps) {

    const [gameComplete, setGameComplete] = React.useState(false);
    const [guessHistory, setGuessHistory] = React.useState<GuessLetter[][]>([]);
    const [gameSettings, setGameSettings] = React.useState<GameSettings>(() => ({...gameSettingsInput}));
    const [difficultyRule, setDifficultyRule] = React.useState(DifficultyRule.None);

    React.useEffect(() => {
        const guesses = gameSettingsInput.guesses.map(guess => 
            guess.toUpperCase().substring(0, gameSettingsInput.solution.length));
        const guessData: GuessLetter[][] = [];

        for (const guess of guesses) {
            guessData.push(gradeGuess(gameSettingsInput.solution, guess));
            if (guessData[guessData.length-1].every((letter) => letter.status === LetterStatus.Correct)) {
                setGameComplete(true);
                break;
            }
        }

        setGuessHistory(guessData);
        setGameSettings({...gameSettingsInput});
    }
    , [gameSettingsInput]);


    function handleGuess(guess: string) {
        const guessData = gradeGuess(gameSettings.solution, guess);
        setGuessHistory([...guessHistory, guessData]);
        if (guessData.every((letter) => letter.status === LetterStatus.Correct)) {
            setGameComplete(true);
        }
        setGameSettings({...gameSettings, guesses: [...gameSettings.guesses, guess]});
    }

    function handleDifficultyTipCallback(guess: string): boolean {
        const result = difficultyValidationService.guessIsValid(guess, guessHistory, gameSettings.difficulty) 
        if (!result[0]) {
            setDifficultyRule(result[1]);
        }
        return result[0];
    }

    function clearDifficultyTip() {
        setDifficultyRule(DifficultyRule.None);
    }

    if (!gameSettings || !gameSettings.solution) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen w-full">
            <div className="w-full p-2">
                <StatusHeader gameSettings={gameSettings}/>
            </div>
            <div className="w-full p-2 bg-gray-100 rounded-md shadow-md">
                <DifficultyTip difficultyRule={difficultyRule} />
            </div>
            { /* debug */ }
            <div className='flex flex-col w-full p-4 break-words'>
                <div>{JSON.stringify(gameSettings)}</div>
                <p>{ urlService.btoaUrlSafe(JSON.stringify(gameSettings)) }</p>
            </div>
            <div className="flex-grow">
                <GuessHistory guessHistory={guessHistory} />
            </div>
            <div className="bottom-0 w-full py-4 pb-8">
                <KeyboardGuess
                    onSubmit={(guess) => handleGuess(guess)}
                    wordLength={gameSettings.solution.length}
                    disabled={gameComplete}
                    gameSettings={gameSettings}
                    handleDifficultyTipCallback={handleDifficultyTipCallback}
                    clearDifficultyTip={clearDifficultyTip}
                />
            </div>
        </div>
    )
}

