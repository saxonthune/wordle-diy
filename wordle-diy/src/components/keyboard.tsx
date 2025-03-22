'use client'

import React from 'react';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  canSubmit: boolean;
  gameComplete: boolean;
}

export default function Keyboard({ onKeyPress, canSubmit, gameComplete }: KeyboardProps) {
  const handleButtonClick = (key: string) => {
    onKeyPress(key);
  };

  const displayEnter = () => {
    if (gameComplete) {
      return "😎";
    }
    return canSubmit ? "🚀" : "⛔";
  }

  const buttonClass = "rounded bg-gray-500 min-w-[28px] className=text-[clamp(0.75rem, 2vw, 1.5rem)]";
  const submitBackButtonClass = "text-[clamp(0.75rem, 2vw, 1.5rem)]";

  return (
    <div className="text-2xl text-white">
      <div className="grid grid-cols-10 gap-2 pb-2">
        <button className={buttonClass} onClick={() => handleButtonClick('Q')}>Q</button>
        <button className={buttonClass} onClick={() => handleButtonClick('W')}>W</button>
        <button className={buttonClass} onClick={() => handleButtonClick('E')}>E</button>
        <button className={buttonClass} onClick={() => handleButtonClick('R')}>R</button>
        <button className={buttonClass} onClick={() => handleButtonClick('T')}>T</button>
        <button className={buttonClass} onClick={() => handleButtonClick('Y')}>Y</button>
        <button className={buttonClass} onClick={() => handleButtonClick('U')}>U</button>
        <button className={buttonClass} onClick={() => handleButtonClick('I')}>I</button>
        <button className={buttonClass} onClick={() => handleButtonClick('O')}>O</button>
        <button className={buttonClass} onClick={() => handleButtonClick('P')}>P</button>
      </div>
      <div className="grid grid-cols-9 gap-2 pb-2">
        <button className={buttonClass} onClick={() => handleButtonClick('A')}>A</button>
        <button className={buttonClass} onClick={() => handleButtonClick('S')}>S</button>
        <button className={buttonClass} onClick={() => handleButtonClick('D')}>D</button>
        <button className={buttonClass} onClick={() => handleButtonClick('F')}>F</button>
        <button className={buttonClass} onClick={() => handleButtonClick('G')}>G</button>
        <button className={buttonClass} onClick={() => handleButtonClick('H')}>H</button>
        <button className={buttonClass} onClick={() => handleButtonClick('J')}>J</button>
        <button className={buttonClass} onClick={() => handleButtonClick('K')}>K</button>
        <button className={buttonClass} onClick={() => handleButtonClick('L')}>L</button>
      </div>
      <div className="grid grid-cols-9 gap-2">
        <button className={submitBackButtonClass} onClick={() => handleButtonClick('enter')}>{displayEnter()}</button>
        <button className={buttonClass} onClick={() => handleButtonClick('Z')}>Z</button>
        <button className={buttonClass} onClick={() => handleButtonClick('X')}>X</button>
        <button className={buttonClass} onClick={() => handleButtonClick('C')}>C</button>
        <button className={buttonClass} onClick={() => handleButtonClick('V')}>V</button>
        <button className={buttonClass} onClick={() => handleButtonClick('B')}>B</button>
        <button className={buttonClass} onClick={() => handleButtonClick('N')}>N</button>
        <button className={buttonClass} onClick={() => handleButtonClick('M')}>M</button>
        <button className={submitBackButtonClass} onClick={() => handleButtonClick('back')}>🔙</button>
      </div>
    </div>
  );
}