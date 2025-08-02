'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameSettings } from '@/types/GameSettings';

interface GameSettingsContextType {
  gameSettings: GameSettings | null;
  setGameSettings: (settings: GameSettings) => void;
  updateGameSettings: (updates: Partial<GameSettings>) => void;
}

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

interface GameSettingsProviderProps {
  children: ReactNode;
  initialSettings?: GameSettings;
}

export const GameSettingsProvider: React.FC<GameSettingsProviderProps> = ({ 
  children, 
  initialSettings 
}) => {
  const [gameSettings, setGameSettingsState] = useState<GameSettings | null>(
    initialSettings || null
  );

  // Update context when initialSettings prop changes
  useEffect(() => {
    if (initialSettings) {
      setGameSettingsState(initialSettings);
    }
  }, [initialSettings]);

  const setGameSettings = (settings: GameSettings) => {
    setGameSettingsState(settings);
  };

  const updateGameSettings = (updates: Partial<GameSettings>) => {
    if (gameSettings) {
      setGameSettingsState({ ...gameSettings, ...updates });
    }
  };

  return (
    <GameSettingsContext.Provider value={{
      gameSettings,
      setGameSettings,
      updateGameSettings
    }}>
      {children}
    </GameSettingsContext.Provider>
  );
};

export const useGameSettings = () => {
  const context = useContext(GameSettingsContext);
  if (context === undefined) {
    throw new Error('useGameSettings must be used within a GameSettingsProvider');
  }
  return context;
};
