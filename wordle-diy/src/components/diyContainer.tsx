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
    const [difficulty, setDifficulty] = React.useState(Difficulty.Normal);
    const [difficultyBlurb, setDifficultyBlurb] = React.useState("");
    const [gameUrl, setGameUrl] = React.useState<string>("");
    const [canCreateUrl, setCanCreateUrl] = React.useState(false);

    const difficultyTip = 'Difficulty determines how previous guesses impact which letters a player can input on their current guess.';
    const parTip = 'Wordle DIY does not have a guess limit, but you can set a recommended number of guesses, or par, for players.';
    const lengthTip = 'You can pick any word length, but only five-letter solutions currently have dictionary support.';

    function handleSolutionChange(event: React.ChangeEvent<HTMLInputElement>) {
        setGameUrl("");
        if (/^[a-zA-Z]*$/.test(event.target.value) && event.target.value.length <= 30) {
            setSolution(event.target.value.toUpperCase());
        }

        if (!event.target.value || event.target.value.length === 0) {
            setCanCreateUrl(false);
            setValidSolutionTip("");
            return;
        }

        switch (guessIsInWordBank(event.target.value.toUpperCase())) {
            case true:
                setCanCreateUrl(true);
                setValidSolutionTip("✅");
                break;
            case false:
                setCanCreateUrl(false);
                setValidSolutionTip("⛔ not in dictionary");
                break;
            case null:
                setCanCreateUrl(true);
                setValidSolutionTip("❔ no dictionary support for this length");
        }
    }

    function handleDifficultyChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const newDifficulty: Difficulty = parseInt(event.target.value);
        setDifficulty(newDifficulty);
        switch (newDifficulty) {
            case Difficulty.Normal:
                setDifficultyBlurb("Normal difficulty is the default Wordle experience.");
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
        if (solution.length === 0) {
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
        <div className="flex flex-col min-h-screen break-words p-2 gap-4">
            <h1 className="flex justify-center text-3xl pb-8">Wordle DIY</h1>
            <div className="flex flex-col gap-2">
                <label className="text-lg" htmlFor="answer">Solution</label>
                <input className="p-2 border border-gray-300" id="word" type="text" 
                    value={solution} onChange={handleSolutionChange}/>
                <p>Solution Validity: {validSolutionTip}</p>
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
                    <option value={Difficulty.Normal}>Regular</option>
                    <option value={Difficulty.NytHard}>Nyt Hard</option>
                    <option value={Difficulty.Hard}>Really Hard</option>
                </select>
                <i>{difficultyTip}</i>
                <p>{difficultyBlurb}</p>
            </div>
            {canCreateUrl
                ? <button className="bg-blue-500 text-white p-2 rounded cursor-pointer" 
                    onClick={handleGenerateOnClick}>Generate Code</button>
                : <></>
            }
            
            { (gameUrl && canCreateUrl) ? <div className='mx-auto break-words p-2 pt-4'>
                <p><b>✅ Success!</b> Your wordle game with solution &lsquo;{solution}&rsquo; has been created. Open{' '}
                <a href={gameUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    {"this link\u{29C9}"}
                </a>
                    {" in a new tab, or copy and send it to a friend!"}
                </p>
            </div>
            : <></>}
        </div>
    );
}