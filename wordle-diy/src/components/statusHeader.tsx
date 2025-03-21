import { Difficulty } from "@/types/Difficulty";
import { GameSettings } from "@/types/GameSettings";

export default function StatusHeader({ gameSettings }: { gameSettings: GameSettings}) {


    return (
        <div className="status-header grid grid-cols-2 gap-2 text-center">
            <p>{`Guesses: ${gameSettings.guesses.length}/${gameSettings.par}`}</p>
            <p>{`Difficulty: ${Difficulty[gameSettings.difficulty]}`}</p>
            <p></p>
        </div>
    );
}