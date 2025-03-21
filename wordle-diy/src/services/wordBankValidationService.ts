import wordBank5Data from "@/assets/5.json";

let wordBank5: string[] | null = null; 

export function getWordBank(length: number) {
    if (length === 5) {
        wordBank5 = wordBank5Data;
        return wordBank5;
    }
    return [];
}

export function guessIsInWordBank(guess: string): boolean | null {
    const wordBank = getWordBank(guess.length);
    if (wordBank.length === 0) // if word length is not yet supported, allow all guesses
        return null; 
    console.log("wordBank len", wordBank.length)
    return wordBank.includes(guess);
}