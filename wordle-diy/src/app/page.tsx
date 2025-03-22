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
        difficulty: Difficulty.Normal,
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
        const code = new URL(url).searchParams.get('code');
        if (!code || code.length === 0){
            window.location.href = '/diy';
            return;
        }

        const gameSettingsString = urlService.atobUrlSafe(code.replace(/-/g, '+').replace(/_/g, '/'));
        setGameSettings(JSON.parse(gameSettingsString) as GameSettings);
    }

  return (
      <main className="h-full flex"
        style={{ height: 'calc(var(--vh, 1vh)' }}
      >
        <GameContainer gameSettingsInput={gameSettings} />
      </main>
  );
}
