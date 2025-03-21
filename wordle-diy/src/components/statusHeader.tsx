import { Difficulty } from "@/types/Difficulty";
import { GameSettings } from "@/types/GameSettings";

export default function StatusHeader({ gameSettings }: { gameSettings: GameSettings}) {


    return (
        <div className="status-header grid grid-cols-3 gap-2 text-center">
            <p className="justify-self-start">{`Guesses: ${gameSettings.guesses.length}/${gameSettings.par}`}</p>
            <p className="justify-self-start">{`Difficulty: ${Difficulty[gameSettings.difficulty]}`}</p>
            <div className="justify-self-end"><button className="bg-blue-500 rounded text-white px-2 hover:text-gray-700" onClick={() => window.location.href = '/diy'}>DIY</button></div>
            <p></p>
        </div>
    );
}