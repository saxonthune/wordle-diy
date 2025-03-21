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

interface GameContainerProps {
    gameSettingsInput: GameSettings;
}

export default function GameContainer( { gameSettingsInput }: GameContainerProps) {

    const [gameComplete, setGameComplete] = React.useState(false);
    const [guessHistory, setGuessHistory] = React.useState<GuessLetter[][]>([]);
    const [gameSettings, setGameSettings] = React.useState<GameSettings>(() => ({...gameSettingsInput}));

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

    if (!gameSettings || !gameSettings.solution) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen w-full">
            <div className="w-full p-2">
                <StatusHeader gameSettings={gameSettings}/>
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
                />
            </div>
        </div>
    )
}

