import { Difficulty } from "@/types/Difficulty";
import { GuessLetter } from "@/types/GuessLetter";
import { LetterStatus } from "@/types/letterStatus";

export function guessIsValid(guess: string, guessHistory: GuessLetter[][], difficulty: Difficulty): [boolean, string] {
    switch (difficulty) {
        case Difficulty.Regular:
            return regular(guess, guessHistory);
        case Difficulty.NytHard:
            return nytHard(guess, guessHistory);
        case Difficulty.Hard:
            return hard(guess, guessHistory);
        default:
            return [true, ""];
    }
}

function regular(guess: string, guessHistory: GuessLetter[][]): [boolean, string] {
    return fullWordHasNotBeenGuessed(guess, guessHistory);
}

function nytHard(guess: string, guessHistory: GuessLetter[][]): [boolean, string] {
    const result = [fullWordHasNotBeenGuessed(guess, guessHistory),
        allCorrectLettersAreInPosition(guess, guessHistory),
        allPartialLettersAreUsed(guess, guessHistory)];

    return [result.every((element) => element[0]),
            result.find((element) => !element[0])?.[1] || ""];
}

function hard(guess: string, guessHistory: GuessLetter[][]): [boolean, string] {
    const result = [fullWordHasNotBeenGuessed(guess, guessHistory),
        allCorrectLettersAreInPosition(guess, guessHistory),
        allPartialLettersAreUsed(guess, guessHistory),
        notInAnswerLettersAreNotPresent(guess, guessHistory),
        partialLettersAreNotInPreviousPositions(guess, guessHistory)];

    return [result.every((element) => element[0]),
            result.find((element) => !element[0])?.[1] || ""];
}


function fullWordHasNotBeenGuessed(guess: string, guessHistory: GuessLetter[][]): [boolean, string] {
    for (const guessData of guessHistory) {
        if (guess === guessData.map((letter) => letter.letter).join("")) {
            return [false, "This word has already been guessed."];
        }
    }
    return [true, ""];
}

function allCorrectLettersAreInPosition(guess: string, guessHistory: GuessLetter[][]): [boolean, string] {
    for (const guessData of guessHistory) {
        for (let i = 0; i < guessData.length; i++) {
            if (guessData[i].status === LetterStatus.Correct) {
                if (guess[i] !== guessData[i].letter) {
                    return [false, "Guesses must use revealed letters in the correct position."];
                }
            }
        }
    }
    return [true, ""];
}

// assumes that most recent guess will have all necessary data; this is valid if the ruleset is static
function allPartialLettersAreUsed(guess: string, guessHistory: GuessLetter[][]): [boolean, string] {
    const partialLetters = guessHistory[guessHistory.length - 1]
        .filter((letter) => letter.status === LetterStatus.Partial)
        .map((letter) => letter.letter);
    for (const letter of guess) {
        if (partialLetters.includes(letter)) {
            partialLetters.splice(partialLetters.indexOf(letter), 1);
        }
        else {
            return [false, "Guesses must use all partial (yellow) clues."];
        }
    }
    return [true, ""];
}

function notInAnswerLettersAreNotPresent(guess: string, guessHistory: GuessLetter[][]): [boolean, string] {
    const unusedLettersInGuessHistory = guessHistory.flat(1)
        .filter((letter) => letter.status === LetterStatus.NotInAnswer)
        .map((letter) => letter.letter);
    for (const letter of guess) {
        if (unusedLettersInGuessHistory.includes(letter)) {
            return [false, "Guess uses letters that are known not to be in the answer."];
        }
    }

    return [true, ""];
}

function partialLettersAreNotInPreviousPositions(guess: string, guessHistory: GuessLetter[][]): [boolean, string] {
    for (let i = 0; i < guess.length; i++) {
        for (const guessData of guessHistory) {
            if (guessData[i].status === LetterStatus.Partial) {
                if (guess[i] === guessData[i].letter){
                    return [false, "Guess uses a correct letter in position known to be incorrect."];
                }
            }
        }
    }
    return [true, ""];
}
