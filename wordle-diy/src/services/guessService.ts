import { LetterStatus } from "@/types/letterStatus";
import { GuessLetter } from "@/types/GuessLetter";

export function gradeGuess(answer: string, guess: string): GuessLetter[] {
    if (answer.length !== guess.length) {
        throw new Error("Answer and guess must be the same length");
    }

    let letterBank = answer;

    const letterStatuses = Array(answer.length).fill(LetterStatus.NotInAnswer);

    // Need to remove correct letters from letterBank, before checking for duplicates in wrong position
    for (let i = 0; i < guess.length; i++) {

        if (answer[i] === guess[i]) {
            letterStatuses[i] = LetterStatus.Correct;
            const letterBankIndex = letterBank.indexOf(answer[i]);
            letterBank = letterBank.slice(0, letterBankIndex) + letterBank.slice(letterBankIndex + 1);
        }
    }
    for (let i = 0; i < guess.length; i++) {
        if (letterBank.includes(guess[i])) {
            letterStatuses[i] = LetterStatus.Partial;
            const letterBankIndex = letterBank.indexOf(guess[i]);
            letterBank = letterBank.slice(0, letterBankIndex) + letterBank.slice(letterBankIndex + 1);
        }
    }

    const guessData = guess.split("").map((letter, i) => {
        return {
            letter: letter,
            status: letterStatuses[i]
        }
    });

    return guessData;

}