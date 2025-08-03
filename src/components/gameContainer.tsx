'use client'
import React from 'react';
import KeyboardGuess from './keyboardGuess';
import GuessHistory from './guessHistory';
import { gradeGuess } from '../services/guessService';
import { LetterStatus } from '@/types/letterStatus';
import { GuessLetter } from '@/types/GuessLetter';
import StatusHeader from './statusHeader';
import { difficultyValidationService } from '@/services/difficultyValidationService';
import { DifficultyRule } from '@/types/DifficultyRule';
import DifficultyTip from './difficultyTip';
import { BLOCK_SIZE } from '@/constants/constants';
import GameInfoModal from './gameInfoModal';
import GameResultsModal from './gameResultsModal';
import { useGameSettings } from '@/contexts/GameSettingsContext';

export default function GameContainer() {
    const { gameSettings, updateGameSettings } = useGameSettings();
    const [gameComplete, setGameComplete] = React.useState(false);
    const [guessHistory, setGuessHistory] = React.useState<GuessLetter[][]>([]);
    const [difficultyRule, setDifficultyRule] = React.useState(DifficultyRule.None);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isFirstOpen, setIsFirstOpen] = React.useState(true);
    const [isResultsModalOpen, setIsResultsModalOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [animatingLetterIndex, setAnimatingLetterIndex] = React.useState(-1);

    React.useEffect(() => {
        if (!gameSettings) return;
        
        const guesses = gameSettings.guesses.map((guess: string) => 
            guess.toUpperCase().substring(0, gameSettings.solution.length));
        const guessData: GuessLetter[][] = [];

        //guesses.push('AEGIS   '.substring(0, gameSettings.solution.length));
        //guesses.push('PARTY   '.substring(0, gameSettings.solution.length));

        setGameComplete(false);
        for (const guess of guesses) {
            guessData.push(gradeGuess(gameSettings.solution, guess));
            if (guessData[guessData.length-1].every((letter) => letter.status === LetterStatus.Correct)) {
                setGameComplete(true);
                break;
            }
        }

        setGuessHistory(guessData);
        // Don't need to call setGameSettings here since gameSettings is already set from context
    }
    , [gameSettings]);

    // Open modal automatically on first load
    React.useEffect(() => {
        if (gameSettings?.solution && isFirstOpen && gameSettings.guesses.length === 0) {
            setIsModalOpen(true);
        }
    }, [gameSettings?.solution, isFirstOpen, gameSettings?.guesses.length]);


    function handleGuess(guess: string) {
        if (!gameSettings) return;
        
        const guessData = gradeGuess(gameSettings.solution, guess);
        const isCorrectGuess = guessData.every((letter) => letter.status === LetterStatus.Correct);
        
        if (isCorrectGuess) {
            setIsAnimating(true);
            setAnimatingLetterIndex(0);
            
            // Add the guess to history but don't show it as complete yet
            setGuessHistory([...guessHistory, guessData]);
            updateGameSettings({ guesses: [...gameSettings.guesses, guess] });
            
            // Animate each letter revealing one by one
            guessData.forEach((_, index) => {
                setTimeout(() => {
                    setAnimatingLetterIndex(index);
                    
                    // After the last letter animation
                    if (index === guessData.length - 1) {
                        setTimeout(() => {
                            setGameComplete(true);
                            setIsAnimating(false);
                            setAnimatingLetterIndex(-1);
                            // Automatically open results modal after animation
                            setIsResultsModalOpen(true);
                        }, 1200); // Longer delay after last letter before showing completion UI
                    }
                }, index * 300); // 200ms delay between each letter
            });
        } else {
            // Normal non-winning guess
            setGuessHistory([...guessHistory, guessData]);
            updateGameSettings({ guesses: [...gameSettings.guesses, guess] });
        }
    }

    function handleDifficultyTipCallback(guess: string): boolean {
        if (!gameSettings) return false;
        
        const result = difficultyValidationService.guessIsValid(guess, guessHistory, gameSettings.difficulty) 
        if (!result[0]) {
            setDifficultyRule(result[1]);
        }
        return result[0];
    }

    function clearDifficultyTip() {
        setDifficultyRule(DifficultyRule.None);
    }

    function handleModalClose() {
        setIsModalOpen(false);
        setIsFirstOpen(false);
    }

    function handleResultsModalOpen() {
        setIsResultsModalOpen(true);
    }

    function handleResultsModalClose() {
        setIsResultsModalOpen(false);
    }

    if (!gameSettings || !gameSettings.solution) {
        console.log('GameContainer: gameSettings is null or has no solution:', gameSettings);
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col w-[400px] mx-auto bg-white rounded-md shadow-lg">
            { difficultyRule !== DifficultyRule.None ?
                <div className="sticky w-full p-2 bg-yellow-100 rounded-md shadow-md">
                    <DifficultyTip difficultyRule={difficultyRule} />
                </div>
                : <div className="sticky w-full p-2 bg-gray-200 rounded-md">
                <StatusHeader gameSettings={gameSettings} onInfoClick={() => setIsModalOpen(true)} />
            </div>
            }
            <div className="flex-grow overflow-y-auto p-2">
                {
                // process.env.NODE_ENV === 'development' && (
                //     <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                //         <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                //             {JSON.stringify(gameSettings, null, 2)}
                //         </pre>
                //     </div>
                // )
                }
                {
                /* <div id='debug' className='flex flex-col w-full p-4 break-words'>
                    <div>{JSON.stringify(gameSettings)}</div>
                </div> */
                }
                <GuessHistory 
                    guessHistory={guessHistory} 
                    isAnimating={isAnimating}
                    animatingGuessIndex={guessHistory.length - 1}
                    animatingLetterIndex={animatingLetterIndex}
                />
                {!gameComplete && !isAnimating ? (
                    <div className={`grid gap-1 pb-[4px] items-center justify-center mx-auto`}
                        key={guessHistory.length}
                        style={{
                            gridTemplateColumns: `repeat(${gameSettings.solution.length}, minmax(0, 1fr))`, 
                            maxWidth: `${(BLOCK_SIZE+4)*gameSettings.solution.length}px`, 
                        }}
                    >
                        {gameSettings.solution.split('').map((letter, i) => (
                            <div key={i} className={`border-1 border-gray-300 max-h-[40px] aspect-square rounded items-center justify-center`}>
                            </div>
                        ))}
                    </div>
                ) : gameComplete && !isAnimating ? (
                    <div className="text-center mt-4">
                        <a 
                            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors font-bold"
                            href={`${process.env.NEXT_PUBLIC_ROOT_URL}/diy`}
                        >
                            Make Your Own Wordle!
                        </a>
                    </div>
                ) : null}
            </div>
            <div className="sticky bottom-0 w-full pb-1 pt-1 bg-white border-t border-gray-300 rounded-b-md">
                <KeyboardGuess
                    onSubmit={(guess) => handleGuess(guess)}
                    wordLength={gameSettings.solution.length}
                    disabled={gameComplete || isAnimating}
                    gameSettings={gameSettings}
                    handleDifficultyTipCallback={handleDifficultyTipCallback}
                    clearDifficultyTip={clearDifficultyTip}
                    guessHistory={guessHistory}
                    onViewResults={handleResultsModalOpen}
                    isAnimating={isAnimating}
                />
            </div>
              <GameInfoModal 
                isOpen={isModalOpen}
                onClose={handleModalClose}
                gameSettingsInput={gameSettings}
                firstOpen={isFirstOpen}
            />
            <GameResultsModal
                isOpen={isResultsModalOpen}
                onClose={handleResultsModalClose}
                guessHistory={guessHistory}
                gameSettings={gameSettings}
            />
        </div>
    )
}

