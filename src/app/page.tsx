'use client'
import GameContainer from "@/components/gameContainer";
import { urlService } from "@/services/urlService";
import { Difficulty } from "@/types/Difficulty";
import { GameSettings } from "@/types/GameSettings";
import { GameSettingsProvider } from "@/contexts/GameSettingsContext";
import React from "react";

export default function Home() {
    const defaultGameSettings: GameSettings = {
        solution: "",
        guesses: [],
        par: 6,
        difficulty: Difficulty.Normal,
        version: "1.0",
        author: "",
        descriptor: "",
        useDictionary: true
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
            window.location.href = process.env.NEXT_PUBLIC_ROOT_URL + '/diy';
            return;
        }

        const gameSettingsString = urlService.atobUrlSafe(code.replace(/-/g, '+').replace(/_/g, '/'));
        setGameSettings(JSON.parse(gameSettingsString) as GameSettings);
    }

  return (
      <GameSettingsProvider initialSettings={gameSettings}>
        <main className="h-full flex rounded"
          style={{ height: 'calc(var(--vh, 1vh)' }}
        >
          <GameContainer />
        </main>
      </GameSettingsProvider>
  );
}
