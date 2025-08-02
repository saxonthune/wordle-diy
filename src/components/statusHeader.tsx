'use client'
import { GameSettings } from "@/types/GameSettings";

interface StatusHeaderProps {
    gameSettings: GameSettings;
    onInfoClick?: () => void;
}

export default function StatusHeader({ gameSettings, onInfoClick }: StatusHeaderProps) {
    return (
        <div className="status-header grid grid-cols-3 gap-2 text-center items-center">
            <div className="justify-self-start flex items-center">
                {onInfoClick && (
                    <button
                        className="hover:bg-gray-400 bg-blue-500 rounded-full w-8 h-8 rounded text-xl transition-colors flex items-center justify-center"
                        onClick={onInfoClick}
                    >
                        ❔️
                    </button>
                )}
                <p className="justify-self-start font-bold text-xl ml-3">
                    <span className="inline">{`${gameSettings.guesses.length}/${gameSettings.par}`}</span>
                </p>
            </div>
            <p className="font-bold text-xl">
                <span className="inline">Wordle DIY</span>
            </p>
            <div className="justify-self-end flex gap-2 items-center">
                <a className="bg-blue-500 rounded text-white px-2 hover:text-gray-700" href={`${process.env.NEXT_PUBLIC_ROOT_URL}/diy`}>DIY</a>
            </div>
        </div>
    );
}