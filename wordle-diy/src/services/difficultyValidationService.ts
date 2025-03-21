import { Difficulty } from "@/types/Difficulty";
import { DifficultyRule } from "@/types/DifficultyRule";
import { GuessLetter } from "@/types/GuessLetter";
import { LetterStatus } from "@/types/letterStatus";

interface GuessValidationService {
    guessIsValid: (guess: string, guessHistory: GuessLetter[][], difficulty: Difficulty) => [boolean, DifficultyRule];
}

export const guessValidationService: GuessValidationService = {
    guessIsValid(guess: string, guessHistory: GuessLetter[][], difficulty: Difficulty): [boolean, DifficultyRule] {
        switch (difficulty) {
            case Difficulty.Regular:
                return regular(guess, guessHistory);
            case Difficulty.NytHard:
                return nytHard(guess, guessHistory);
            case Difficulty.Hard:
                return hard(guess, guessHistory);
            default:
                return [true, DifficultyRule.none];
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
            result.find((element) => !element[0])?.[1] || DifficultyRule.none];
}

function hard(guess: string, guessHistory: GuessLetter[][]): [boolean, DifficultyRule] {
    const result = [fullWordHasNotBeenGuessed(guess, guessHistory),
        allCorrectLettersAreInPosition(guess, guessHistory),
        allPartialLettersAreUsed(guess, guessHistory),
        notInAnswerLettersAreNotPresent(guess, guessHistory),
        partialLettersAreNotInPreviousPositions(guess, guessHistory)];

    return [result.every((element) => element[0]),
            result.find((element) => !element[0])?.[1] || DifficultyRule.none];
}


function fullWordHasNotBeenGuessed(guess: string, guessHistory: GuessLetter[][]): [boolean, DifficultyRule] {
    for (const guessData of guessHistory) {
        if (guess === guessData.map((letter) => letter.letter).join("")) {
            return [false, DifficultyRule.fullWordHasNotBeenGuessed];
        }
    }
    return [true, DifficultyRule.fullWordHasNotBeenGuessed];
}

function allCorrectLettersAreInPosition(guess: string, guessHistory: GuessLetter[][]): [boolean, DifficultyRule] {
    for (const guessData of guessHistory) {
        for (let i = 0; i < guessData.length; i++) {
            if (guessData[i].status === LetterStatus.Correct) {
                if (guess[i] !== guessData[i].letter) {
                    return [false, DifficultyRule.allCorrectLettersAreInPosition];
                }
            }
        }
    }
    return [true, DifficultyRule.allCorrectLettersAreInPosition];
}

// assumes that most recent guess will have all necessary data; this is valid if the ruleset is static
function allPartialLettersAreUsed(guess: string, guessHistory: GuessLetter[][]): [boolean, DifficultyRule] {
    const partialLetters = guessHistory[guessHistory.length - 1]
        .filter((letter) => letter.status === LetterStatus.Partial)
        .map((letter) => letter.letter);
    for (const letter of guess) {
        if (partialLetters.includes(letter)) {
            partialLetters.splice(partialLetters.indexOf(letter), 1);
        }
        else {
            return [false, DifficultyRule.allPartialLettersAreUsed];
        }
    }
    return [true, DifficultyRule.allPartialLettersAreUsed];
}

function notInAnswerLettersAreNotPresent(guess: string, guessHistory: GuessLetter[][]): [boolean, DifficultyRule] {
    const unusedLettersInGuessHistory = guessHistory.flat(1)
        .filter((letter) => letter.status === LetterStatus.NotInAnswer)
        .map((letter) => letter.letter);
    for (const letter of guess) {
        if (unusedLettersInGuessHistory.includes(letter)) {
            return [false, DifficultyRule.notInAnswerLettersAreNotPresent];
        }
    }

    return [true, DifficultyRule.notInAnswerLettersAreNotPresent];
}

function partialLettersAreNotInPreviousPositions(guess: string, guessHistory: GuessLetter[][]): [boolean, DifficultyRule] {
    for (let i = 0; i < guess.length; i++) {
        for (const guessData of guessHistory) {
            if (guessData[i].status === LetterStatus.Partial) {
                if (guess[i] === guessData[i].letter){
                    return [false, DifficultyRule.partialLettersAreNotInPreviousPositions];
                }
            }
        }
    }
    return [true, DifficultyRule.partialLettersAreNotInPreviousPositions];
}
