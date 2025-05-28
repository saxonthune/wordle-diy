import { Difficulty } from "@/types/Difficulty";
import { GameSettings } from "@/types/GameSettings";

export default function StatusHeader({ gameSettings }: { gameSettings: GameSettings}) {


    return (
        <div className="status-header grid grid-cols-3 gap-2 text-center">
            <p className="justify-self-start">
                <span className="hidden sm:inline">{'Guess: '}</span>
                <span className="inline">{`${gameSettings.guesses.length}/${gameSettings.par}`}</span>
            </p>
            <p className="">
                <span className="hidden sm:inline">{'Difficulty: '}</span>
                <span className="inline">{`${Difficulty[gameSettings.difficulty]}`}</span>
            </p>
            <div className="justify-self-end">
                <a className="bg-blue-500 rounded text-white px-2 hover:text-gray-700" href={`${process.env.NEXT_PUBLIC_ROOT_URL}/diy`}>DIY</a>
            </div>
        </div>
    );
}