export enum DifficultyRule {
    none,
    fullWordHasNotBeenGuessed,
    allCorrectLettersAreInPosition,
    allPartialLettersAreUsed,
    notInAnswerLettersAreNotPresent,
    partialLettersAreNotInPreviousPositions,
}