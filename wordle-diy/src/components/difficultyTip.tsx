import { DifficultyRule } from "@/types/DifficultyRule";

interface difficultyTipProps {
    difficultyRule: DifficultyRule
}

export default function DifficultyTip({ difficultyRule }: difficultyTipProps) {
    switch (difficultyRule) {
        case DifficultyRule.None:
            return <div></div>;
        case DifficultyRule.FullWordHasNotBeenGuessed:
            return <div>This word has already been guessed.</div>;
        case DifficultyRule.AllCorrectLettersAreInPosition:
            return <div>Solved (green) letters must be in the correct position.</div>;
        case DifficultyRule.AllPartialLettersAreUsed:
            return <div>All partial (yellow) letters must be used in the guess.</div>;
        case DifficultyRule.NotInAnswerLettersAreNotPresent:
            return <div>Guess uses letters known to not be in the solution.</div>
        case DifficultyRule.PartialLettersAreNotInPreviousPositions:
            return <div>Guess places partial (yellow) letters in positions known to be incorrect.</div>;
        default:
            return <div></div>;
    }
}