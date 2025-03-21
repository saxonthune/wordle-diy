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
    gameSettings: GameSettings;
}

export default function GameContainer( { gameSettings }: GameContainerProps) {

    const [gameComplete, setGameComplete] = React.useState(false);
    const [guessHistory, setGuessHistory] = React.useState<GuessLetter[][]>([]);

    React.useEffect(() => {
        const guesses = gameSettings.guesses.map(guess => guess.toUpperCase()
            .substring(0, gameSettings.solution.length));
        const guessData: GuessLetter[][] = [];

        for (const guess of guesses) {
            guessData.push(gradeGuess(gameSettings.solution, guess));
            if (guessData[guessData.length-1].every((letter) => letter.status === LetterStatus.Correct)) {
                setGameComplete(true);
                break;
            }
        }

        setGuessHistory(guessData);
    }
    , [gameSettings]);

    function handleGuess(guess: string) {
        const guessData = gradeGuess(gameSettings.solution, guess);
        setGuessHistory([...guessHistory, guessData]);
        if (guessData.every((letter) => letter.status === LetterStatus.Correct)) {
            setGameComplete(true);
        }
    }

    return (
        <div>
            {<StatusHeader gameSettings={gameSettings}/>}
            <GuessHistory guessHistory={guessHistory} />
            <KeyboardGuess 
                onSubmit={(guess) => handleGuess(guess)} 
                wordLength={gameSettings.solution.length} 
                disabled={gameComplete}
            />
            <br />
            <div className='max-w-[400px] mx-auto'>
                <p>DEBUG:</p>
                <p>{JSON.stringify(gameSettings)}</p>
                <p>{ urlService.btoaUrlSafe(JSON.stringify(gameSettings)) }</p>
            </div>
        </div>
    )
}

