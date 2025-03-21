import { Difficulty } from '@/types/Difficulty';

export interface GameSettings {
    solution: string;
    guesses: string[];
    par: number;
    difficulty: Difficulty;
    version: string;
}
