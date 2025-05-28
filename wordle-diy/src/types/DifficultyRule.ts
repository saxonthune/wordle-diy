export enum DifficultyRule {
    None,
    FullWordHasNotBeenGuessed,
    AllCorrectLettersAreInPosition,
    AllPartialLettersAreUsed,
    NotInAnswerLettersAreNotPresent,
    PartialLettersAreNotInPreviousPositions,
}