'use client'
import { urlService } from '@/services/urlService';
import { guessIsInWordBank } from '@/services/wordBankValidationService';
import { Difficulty } from '@/types/Difficulty';
import { GameSettings } from '@/types/GameSettings';
import { descriptors } from '@/constants/descriptors';
import React from 'react';

export default function DiyContainer() {

    const normaldifficultyBlurb = "Normal difficulty is the default Wordle experience."

    const [solution, setSolution] = React.useState("");
    const [validSolutionTip, setValidSolutionTip] = React.useState("");
    const [par, setPar] = React.useState(6);
    const [difficulty, setDifficulty] = React.useState(Difficulty.Normal);
    const [difficultyBlurb, setDifficultyBlurb] = React.useState(normaldifficultyBlurb);
    const [gameUrl, setGameUrl] = React.useState<string>("");
    const [canCreateUrl, setCanCreateUrl] = React.useState(false);
    const [author, setAuthor] = React.useState("");
    const [descriptor, setDescriptor] = React.useState("");
    const [dictionaryBypass, setDictionaryBypass] = React.useState(false);

    const parTip = 'Wordle DIY does not have a guess limit, but you can set a recommended number of guesses, or par, for players.';
    const lengthTip = 'You can pick any word length, but only five-letter solutions currently have dictionary support.';
    
    function validateSolution(solutionValue: string, bypassDictionary: boolean) {
        if (!solutionValue || solutionValue.length === 0) {
            setCanCreateUrl(false);
            setValidSolutionTip("");
            return;
        }

        if (bypassDictionary) {
            setCanCreateUrl(true);
            setValidSolutionTip("✅ Players will be able to guess any combination of letters.");
            return;
        }

        switch (guessIsInWordBank(solutionValue.toUpperCase())) {
            case true:
                setCanCreateUrl(true);
                setValidSolutionTip("✅");
                break;
            case false:
                setCanCreateUrl(false);
                setValidSolutionTip("⛔ Not in dictionary");
                break;
            case null:
                setCanCreateUrl(true);
                setValidSolutionTip("❔ No dictionary support for this length");
        }
    }

    function handleSolutionChange(event: React.ChangeEvent<HTMLInputElement>) {
        setGameUrl("");
        if (/^[a-zA-Z]*$/.test(event.target.value) && event.target.value.length <= 30) {
            setSolution(event.target.value.toUpperCase());
        }
        validateSolution(event.target.value, dictionaryBypass);
    }

    function handleDictionaryBypass(checked: boolean) {
        setDictionaryBypass(checked);
        setGameUrl("");
        validateSolution(solution, checked);
    }
    
    function handleAuthorChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.value.length <= 20) {
            setAuthor(event.target.value);
        }
        setGameUrl("");
    }

    function handleDescriptorChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setDescriptor(event.target.value);
        setGameUrl("");
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
            version: '1',
            author: author?.trim() || "anonymous",
            descriptor: descriptor,
            useDictionary: !dictionaryBypass
        };

        const gameSettingsString = JSON.stringify(gameSettings);
        const gameCode = urlService.btoaUrlSafe(gameSettingsString);

        const url = `${process.env.NEXT_PUBLIC_ROOT_URL}/?code=${gameCode}`;
        console.log(`root url: ${process.env.NEXT_PUBLIC_ROOT_URL}`);
        console.log(`Generated URL: ${url}`);
        setGameUrl(url);
    }

    return (
        <div className="flex flex-col w-[800px] mx-auto break-words gap-2">
            <h1 className="flex justify-center rounded-md shadow-md text-4xl p-2 mx-2 bg-sky-200">Wordle DIY</h1>
            <div className="mx-2 p-2 bg-gray-100 rounded shadow-md">
                <div className="flex flex-col pb-4">
                    <label className="text-lg" htmlFor="answer">Solution</label>
                    <input className="p-2 border rounded-md border-gray-300 bg-white" id="word" type="text"
                        value={solution} onChange={handleSolutionChange} placeholder="Enter your solution here"/>
                    <p className='py-2'>Solution Validity: {validSolutionTip}</p>
                    <i className='pb-2'>{lengthTip}</i>
                    <div className="flex items-center gap-2">
                        <input className="w-4 h-4" id="dictionary" type="checkbox"
                            checked={dictionaryBypass} onChange={(e) => handleDictionaryBypass(e.target.checked)}/>
                        <span>Disable Dictionary</span>
                    </div>
                </div>
                <div className="flex flex-col pb-4">
                    <label className="text-lg" htmlFor="par">Par</label>
                    <input className="p-2 border rounded-md bg-white border-gray-300" id="par" type="number"
                        value={par} onChange={(e) => setPar(Number(e.target.value))}/>
                    <i className='py-2'>{parTip}</i>
                </div>
                <div className="flex flex-col pb-4">
                    <label className="text-lg" htmlFor="difficulty">Difficulty</label>
                    <select className="p-2 border rounded-md bg-white border-gray-300" id="difficulty" onChange={handleDifficultyChange}>
                        <option value={Difficulty.Normal}>Regular</option>
                        <option value={Difficulty.NytHard}>Nyt Hard</option>
                        <option value={Difficulty.Hard}>Really Hard</option>
                    </select>
                    {/* <i>{difficultyTip}</i> */}
                    <i className='pt-2'>{difficultyBlurb}</i>
                </div>
                <div className="flex flex-col pb-4">
                    <label className="text-lg" htmlFor="author">Author</label>
                    <input className="p-2 border rounded-md bg-white border-gray-300" id="author" type="text"
                        value={author} onChange={handleAuthorChange} placeholder="Your name (optional)"/>
                </div>
                <div className="flex flex-col pb-4">
                    <label className="text-lg" htmlFor="descriptor">Vibes</label>
                    <select className="p-2 border rounded-md bg-white border-gray-300" id="descriptor" 
                        value={descriptor} onChange={handleDescriptorChange}>
                        <option value="">-- None --</option>
                        {Object.entries(descriptors)
                            .sort(([, a], [, b]) => a.localeCompare(b))
                            .map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                </div>
                {canCreateUrl
                    ? <button className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
                        onClick={handleGenerateOnClick}>Generate Code</button>
                    : <div className="min-h-[40px]"></div>
                }

                { (gameUrl && canCreateUrl) ? <div className='mx-auto break-words pt-4'>
                    <p><b>✅ Success!</b> Your wordle game with solution &lsquo;{solution}&rsquo; has been created. Open{' '}
                    <a href={gameUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        {"this link\u{29C9}"}
                    </a>
                        {" in a new tab, or copy and send it to a friend!"}
                    </p>
                </div>
                : <div className="min-h-[60px]"></div>}

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                            {JSON.stringify({
                                solution: solution,
                                guesses: [],
                                par: par,
                                difficulty: difficulty,
                                version: '1',
                                author: author?.trim() || "anonymous",
                                descriptor: descriptor,
                                useDictionary: !dictionaryBypass
                            }, null, 2)}
                        </pre>
                    </div>
                )
            }
            </div>

        </div>
    );
}