import { Difficulty } from "@/types/Difficulty";
import { DifficultyRule } from "@/types/DifficultyRule";
import { GuessLetter } from "@/types/GuessLetter";
import { LetterStatus } from "@/types/letterStatus";

interface difficultyValidationService {
    guessIsValid: (guess: string, guessHistory: GuessLetter[][], difficulty: Difficulty) => [boolean, DifficultyRule];
}

export const difficultyValidationService: difficultyValidationService = {
    guessIsValid(guess: string, guessHistory: GuessLetter[][], difficulty: Difficulty): [boolean, DifficultyRule] {
        switch (difficulty) {
            case Difficulty.Regular:
                return regular(guess, guessHistory);
            case Difficulty.NytHard:
                return nytHard(guess, guessHistory);
            case Difficulty.Hard:
                return hard(guess, guessHistory);
            default:
                return [true, DifficultyRule.None];
        }
    }
}

function regular(guess: string, guessHistory: GuessLetter[][]): [boolean, DifficultyRule] {
    return fullWordHasNotBeenGuessed(guess, guessHistory);
}

function nytHard(guess: string, guessHistory: GuessLetter[][]): [boolean, DifficultyRule] {
    const result = [fullWordHasNotBeenGuessed(guess, guessHistory),
        allCorrectLettersAreInPosition(guess, guessHistory),
        allPartialLettersAreUsed(guess, guessHistory)];

    return [result.every((element) => element[0]),
            result.find((element) => !element[0])?.[1] || DifficultyRule.None];
}

function hard(guess: string, guessHistory: GuessLetter[][]): [boolean, DifficultyRule] {
    const result = [fullWordHasNotBeenGuessed(guess, guessHistory),
        allCorrectLettersAreInPosition(guess, guessHistory),
        allPartialLettersAreUsed(guess, guessHistory),
        notInAnswerLettersAreNotPresent(guess, guessHistory),
        partialLettersAreNotInPreviousPositions(guess, guessHistory)];

    return [result.every((element) => element[0]),
            result.find((element) => !element[0])?.[1] || DifficultyRule.None];
}


export function fullWordHasNotBeenGuessed(guess: string, guessHistory: GuessLetter[][]): [boolean, DifficultyRule] {
    for (const guessData of guessHistory) {
        if (guess === guessData.map((letter) => letter.letter).join("")) {
            return [false, DifficultyRule.FullWordHasNotBeenGuessed];
        }
    }
    return [true, DifficultyRule.FullWordHasNotBeenGuessed];
}

export function allCorrectLettersAreInPosition(guess: string, guessHistory: GuessLetter[][]): [boolean, DifficultyRule] {
    for (const guessData of guessHistory) {
        for (let i = 0; i < guessData.length; i++) {
            if (guessData[i].status === LetterStatus.Correct) {
                if (guess[i] !== guessData[i].letter) {
                    return [false, DifficultyRule.AllCorrectLettersAreInPosition];
                }
            }
        }
    }
    return [true, DifficultyRule.AllCorrectLettersAreInPosition];
}

// assumes that most recent guess will have all necessary data; this is valid if the ruleset is static throughout the game
export function allPartialLettersAreUsed(guess: string, guessHistory: GuessLetter[][]): [boolean, DifficultyRule] {
    if (guessHistory.length === 0) {
        return [true, DifficultyRule.AllPartialLettersAreUsed];
    }

    const partialLetters = guessHistory[guessHistory.length - 1]
        .filter((letter) => letter.status === LetterStatus.Partial)
        .map((letter) => letter.letter);
    for (const letter of guess) {
        if (partialLetters.includes(letter)) {
            partialLetters.splice(partialLetters.indexOf(letter), 1);
        }
    }
    return [partialLetters.length === 0, DifficultyRule.AllPartialLettersAreUsed];
}

export function notInAnswerLettersAreNotPresent(guess: string, guessHistory: GuessLetter[][]): [boolean, DifficultyRule] {
    const unusedLettersInGuessHistory = guessHistory.flat(1)
        .filter((letter) => letter.status === LetterStatus.NotInAnswer)
        .map((letter) => letter.letter);
    for (const letter of guess) {
        if (unusedLettersInGuessHistory.includes(letter)) {
            return [false, DifficultyRule.NotInAnswerLettersAreNotPresent];
        }
    }

    return [true, DifficultyRule.NotInAnswerLettersAreNotPresent];
}

export function partialLettersAreNotInPreviousPositions(guess: string, guessHistory: GuessLetter[][]): [boolean, DifficultyRule] {
    for (let i = 0; i < guess.length; i++) {
        for (const guessData of guessHistory) {
            if (guessData[i].status === LetterStatus.Partial) {
                if (guess[i] === guessData[i].letter){
                    return [false, DifficultyRule.PartialLettersAreNotInPreviousPositions];
                }
            }
        }
    }
    return [true, DifficultyRule.PartialLettersAreNotInPreviousPositions];
}
