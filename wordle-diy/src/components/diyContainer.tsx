'use client'
import { urlService } from '@/services/urlService';
import { guessIsInWordBank } from '@/services/wordBankValidationService';
import { Difficulty } from '@/types/Difficulty';
import { GameSettings } from '@/types/GameSettings';
import React from 'react';

export default function DiyContainer() {

    const [solution, setSolution] = React.useState("");
    const [validSolutionTip, setValidSolutionTip] = React.useState("");
    const [par, setPar] = React.useState(6);
    const [difficulty, setDifficulty] = React.useState(Difficulty.Regular);
    const [difficultyBlurb, setDifficultyBlurb] = React.useState("");
    const [gameUrl, setGameUrl] = React.useState<string>("");

    const difficultyTip = 'Difficulty determines how previous guesses impact which letters a player can input on their current guess.';
    const parTip = 'Wordle DIY does not have a guess limit, but you can set a recommended number of guesses, or par, for players.';
    const lengthTip = 'You can pick any word length, but currently only five-letter have dictionary support.';

    function handleSolutionChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (/^[a-zA-Z]*$/.test(event.target.value) && event.target.value.length <= 30) {
            setSolution(event.target.value.toUpperCase());
        }

        switch (guessIsInWordBank(event.target.value.toUpperCase())) {
            case true:
                setValidSolutionTip("✅");
                break;
            case false:
                setValidSolutionTip("⛔");
                break;
            case null:
                setValidSolutionTip("❔ (no dictionary support for this length)");
        }
    }

    function handleDifficultyChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const newDifficulty: Difficulty = parseInt(event.target.value);
        setDifficulty(newDifficulty);
        switch (newDifficulty) {
            case Difficulty.Regular:
                setDifficultyBlurb("Regular difficulty is the default Wordle experience.");
                break;
            case Difficulty.NytHard:
                setDifficultyBlurb("NYT Hard: all correct (green) letters are in the correct position, and all partial (yellow) letters are used.");
                break;
            case Difficulty.Hard:
                setDifficultyBlurb("Hard difficulty that all correct (green) letters are in the correct position, all partial (yellow) letters are used, ruled-out (dark grey) letters cannot be reused, and partial (yellow) letters placed in previous positions.");
                break;
            default:
                setDifficultyBlurb("");
        }
    }

    function handleGenerateOnClick() {
        if (solution.length === 0 || validSolutionTip !== "✅") {
            alert("Please enter a valid solution.");
            return;
        }

        const gameSettings: GameSettings = {
            solution: solution,
            guesses: [],
            par: par,
            difficulty: difficulty,
            version: '1'
        };

        const gameSettingsString = JSON.stringify(gameSettings);
        const gameCode = urlService.btoaUrlSafe(gameSettingsString);

        const url = `${window.location.origin}/?code=${gameCode}`;
        setGameUrl(url);
    }

    return (
        <div className="flex flex-col min-h-screen break-words p-2">
            <h1 className="flex justify-center text-3xl pb-8">Wordle DIY</h1>
            <div className="flex flex-col gap-4">
                <label className="text-lg" htmlFor="answer">Solution</label>
                <input className="p-2 border border-gray-300" id="word" type="text" 
                    value={solution} onChange={handleSolutionChange}/>
                <p>Solution length: {solution.length}.</p>
                <p>Validity: {validSolutionTip}</p>
                <i>{lengthTip}</i>
            </div>
            <div className="flex flex-col gap-4">
                <label className="text-lg" htmlFor="par">Par</label>
                <input className="p-2 border border-gray-300" id="par" type="number"
                    value={par} onChange={(e) => setPar(Number(e.target.value))}/>
                <i>{parTip}</i>
            </div>
            <div className="flex flex-col gap-4">
                <label className="text-lg" htmlFor="difficulty">Difficulty</label>
                <select className="p-2 border border-gray-300" id="difficulty" onChange={handleDifficultyChange}>
                    <option value={Difficulty.Regular}>Regular</option>
                    <option value={Difficulty.NytHard}>Nyt Hard</option>
                    <option value={Difficulty.Hard}>Really Hard</option>
                </select>
                <i>{difficultyTip}</i>
                <p>{difficultyBlurb}</p>
            </div>
            <button className="bg-blue-500 text-white p-2 rounded cursor-pointer" onClick={handleGenerateOnClick}>Generate Code</button>
            
            {/*
            <div className='max-w-[300px] mx-auto break-words'>
                <p><b>code:</b> {new URL(gameUrl).searchParams.get('code')}</p>
                <button className="bg-blue-500 text-white p-2 rounded w-full" onClick={() => navigator.clipboard.writeText( gameUrl. ) }>Copy Code</button>
            </div>
            */}
            { (gameUrl) ? <div className='max-w-[300px] mx-auto break-words'>
                <p><b>url:</b> {gameUrl}</p>
                <button className="bg-blue-500 text-white p-2 rounded w-full cursor-pointer" onClick={() => navigator.clipboard.writeText(gameUrl) }>Copy Url</button>
            </div>
            : <></>}
        </div>
    );
}