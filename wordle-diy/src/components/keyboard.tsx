'use client'

import React from 'react';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  canSubmit: boolean;
}

export default function Keyboard({ onKeyPress, canSubmit }: KeyboardProps) {
  const handleButtonClick = (key: string) => {
    onKeyPress(key);
  };

  return (
    <div>
      <div className="grid grid-cols-10 gap-2">
        <button className="className=text-[clamp(0.75rem, 20vw, 1.5rem)]" onClick={() => handleButtonClick('Q')}>Q</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('W')}>W</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('E')}>E</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('R')}>R</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('T')}>T</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('Y')}>Y</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('U')}>U</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('I')}>I</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('O')}>O</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('P')}>P</button>
      </div>
      <div className="grid grid-cols-9 gap-2">
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('A')}>A</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('S')}>S</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('D')}>D</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('F')}>F</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('G')}>G</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('H')}>H</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('J')}>J</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('K')}>K</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('L')}>L</button>
      </div>
      <div className="grid grid-cols-9 gap-2">
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('enter')}>{canSubmit ? "🚀" : "⛔"}</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('Z')}>Z</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('X')}>X</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('C')}>C</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('V')}>V</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('B')}>B</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('N')}>N</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('M')}>M</button>
        <button className="className=text-[clamp(0.75rem, 2vw, 1.5rem)]" onClick={() => handleButtonClick('back')}>🔙</button>
      </div>
    </div>
  );
}