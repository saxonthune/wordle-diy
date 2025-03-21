'use client'
import GameContainer from "@/components/gameContainer";
import { urlService } from "@/services/urlService";
import { Difficulty } from "@/types/Difficulty";
import { GameSettings } from "@/types/GameSettings";
import React from "react";

export default function Home() {

    const defaultGameSettings: GameSettings = {
        solution: "",
        guesses: [],
        par: 6,
        difficulty: Difficulty.Regular,
        version: "1.0"
    };

    const [gameSettings, setGameSettings] = React.useState(defaultGameSettings);

    React.useEffect(() => {
        LoadSettingsFromUrl();
    }
    ,[] );

    function LoadSettingsFromUrl()
    {
        const url = window.location.href;
        // get code from param
        const code = new URL(url).searchParams.get('code');
        if (!code || code.length === 0){
            window.location.href = '/diy';
            return;
        }

        console.log("url", url);
        console.log("leaf", code);
        const gameSettingsString = urlService.atobUrlSafe(code.replace(/-/g, '+').replace(/_/g, '/'));
        setGameSettings(JSON.parse(gameSettingsString) as GameSettings);
        console.log("gameSettingsString", gameSettingsString);
        console.log("gameSettings", JSON.parse(gameSettingsString));
    }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

        <GameContainer gameSettings={gameSettings} />
      </main>
    </div>
  );
}
