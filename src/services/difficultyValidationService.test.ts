import { GuessLetter } from "../types/GuessLetter";
import { allCorrectLettersAreInPosition, fullWordHasNotBeenGuessed, allPartialLettersAreUsed,
    notInAnswerLettersAreNotPresent, partialLettersAreNotInPreviousPositions
 } from "./difficultyValidationService";
import { LetterStatus } from "../types/letterStatus";
import { DifficultyRule } from "../types/DifficultyRule";

describe("fullWordHasNotBeenGuessed", () => {
    it("should return true if the guess has not been guessed before", () => {
        const guessHistory: GuessLetter[][] = [
            [{ letter: "A", status: LetterStatus.Correct },
            { letter: "R", status: LetterStatus.Correct },
            { letter: "T", status: LetterStatus.Correct },
            { letter: "S", status: LetterStatus.Correct },
            { letter: "Y", status: LetterStatus.Correct }, ],
        ];
        const guess = "APPLE";
        const result = fullWordHasNotBeenGuessed(guess, guessHistory);
        expect(result).toEqual([true, DifficultyRule.FullWordHasNotBeenGuessed]);
    });

    it("should return false if the guess has been guessed before", () => {
        const guessHistory: GuessLetter[][] = [
            [{ letter: "A", status: LetterStatus.Correct },
            { letter: "R", status: LetterStatus.Correct },
            { letter: "T", status: LetterStatus.Correct },
            { letter: "S", status: LetterStatus.Correct },
            { letter: "Y", status: LetterStatus.Correct }, ],
        ];
        const guess = "ARTSY";
        const result = fullWordHasNotBeenGuessed(guess, guessHistory);
        expect(result).toEqual([false, DifficultyRule.FullWordHasNotBeenGuessed]);
    });
});

describe("allCorrectLettersAreInPosition", () => {

    it("should return true if all correct letters are in the correct position", () => {
        const guessHistory: GuessLetter[][] = [
            [{ letter: "A", status: LetterStatus.Correct },
            { letter: "P", status: LetterStatus.Correct },
            { letter: "P", status: LetterStatus.Correct },
            { letter: "L", status: LetterStatus.Correct },
            { letter: "Y", status: LetterStatus.NotInAnswer}, ],
        ];
        const guess = "APPLE";
        const result = allCorrectLettersAreInPosition(guess, guessHistory);
        expect(result).toEqual([true, DifficultyRule.AllCorrectLettersAreInPosition]);
    });

    it("should return false if any correct letter is not in the correct position", () => {
        const guessHistory: GuessLetter[][] = [
            [{ letter: "A", status: LetterStatus.Correct },
            { letter: "P", status: LetterStatus.Correct },
            { letter: "P", status: LetterStatus.Correct},
            { letter: "L", status: LetterStatus.Correct },
            { letter: "Y", status: LetterStatus.NotInAnswer}, ],
        ];
        const guess = "ANGER";
        const result = allCorrectLettersAreInPosition(guess, guessHistory);
        expect(result).toEqual([false, DifficultyRule.AllCorrectLettersAreInPosition]);
    });
});

describe("allPartialLettersAreUsed", () => {
    it("should return true if all partial letters are used", () => {
        const guessHistory: GuessLetter[][] = [
            [{ letter: "G", status: LetterStatus.NotInAnswer},
            { letter: "A", status: LetterStatus.Partial },
            { letter: "T", status: LetterStatus.Partial},
            { letter: "O", status: LetterStatus.NotInAnswer },
            { letter: "R", status: LetterStatus.NotInAnswer }, ],
        ];
        const guess = "GRANT";
        const result = allPartialLettersAreUsed(guess, guessHistory);
        expect(result).toEqual([true, DifficultyRule.AllPartialLettersAreUsed]);
    });

    it("should return false if any partial letter is not used", () => {
        const guessHistory: GuessLetter[][] = [
            [{ letter: "G", status: LetterStatus.Partial },
            { letter: "A", status: LetterStatus.Partial },
            { letter: "T", status: LetterStatus.NotInAnswer},
            { letter: "O", status: LetterStatus.NotInAnswer },
            { letter: "R", status: LetterStatus.NotInAnswer }, ],
        ];
        const guess = "TARDY";
        const result = allPartialLettersAreUsed(guess, guessHistory);
        expect(result).toEqual([false, DifficultyRule.AllPartialLettersAreUsed]);
    });
});

describe("notInAnswerLettersAreNotPresent", () => {
    it("should return true if no letters that are not in the answer are present", () => {
        const guessHistory: GuessLetter[][] = [
            [{ letter: "G", status: LetterStatus.NotInAnswer },
            { letter: "A", status: LetterStatus.Partial },
            { letter: "T", status: LetterStatus.Partial },
            { letter: "O", status: LetterStatus.NotInAnswer },
            { letter: "R", status: LetterStatus.NotInAnswer }, ],
        ];
        const guess = "THANE";
        const result = notInAnswerLettersAreNotPresent(guess, guessHistory);
        expect(result).toEqual([true, DifficultyRule.NotInAnswerLettersAreNotPresent]);
    });

    it("should return false if any letter that is not in the answer is present", () => {
        const guessHistory: GuessLetter[][] = [
            [{ letter: "G", status: LetterStatus.NotInAnswer },
            { letter: "A", status: LetterStatus.Partial },
            { letter: "T", status: LetterStatus.Partial },
            { letter: "O", status: LetterStatus.NotInAnswer },
            { letter: "R", status: LetterStatus.NotInAnswer }, ],
        ];
        const guess = "GRANT";
        const result = notInAnswerLettersAreNotPresent(guess, guessHistory);
        expect(result).toEqual([false, DifficultyRule.NotInAnswerLettersAreNotPresent]);
    });
});

describe("partialLettersAreNotInPreviousPositions", () => {
    it("should return true if no partial letters are in previous positions", () => {
        const guessHistory: GuessLetter[][] = [
            [{ letter: "G", status: LetterStatus.NotInAnswer },
            { letter: "A", status: LetterStatus.Partial },
            { letter: "T", status: LetterStatus.Partial },
            { letter: "O", status: LetterStatus.NotInAnswer },
            { letter: "R", status: LetterStatus.NotInAnswer }, ],
        ];
        const guess = "THANE";
        const result = partialLettersAreNotInPreviousPositions(guess, guessHistory);
        expect(result).toEqual([true, DifficultyRule.PartialLettersAreNotInPreviousPositions]);
    });

    it("should return false if any partial letter is in a previous position", () => {
        const guessHistory: GuessLetter[][] = [
            [{ letter: "G", status: LetterStatus.NotInAnswer },
            { letter: "A", status: LetterStatus.Partial },
            { letter: "T", status: LetterStatus.Partial },
            { letter: "O", status: LetterStatus.NotInAnswer },
            { letter: "R", status: LetterStatus.NotInAnswer }, ],
        ];
        const guess = "TAROT";
        const result = partialLettersAreNotInPreviousPositions(guess, guessHistory);
        expect(result).toEqual([false, DifficultyRule.PartialLettersAreNotInPreviousPositions]);
    });
});
