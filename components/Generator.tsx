import React from 'react';
import { GenerationTheme } from '../types';

interface GeneratorProps {
  currentTheme: string;
  isGenerating: boolean;
  onGenerate: (theme: string) => void;
}

export const Generator: React.FC<GeneratorProps> = ({ currentTheme, isGenerating, onGenerate }) => {
  const themes = Object.values(GenerationTheme);

  return (
    <div className="py-8 overflow-x-auto no-scrollbar">
      <div className="flex gap-2 min-w-max px-4 sm:px-0">
        {themes.map((theme) => (
          <button
            key={theme}
            onClick={() => onGenerate(theme)}
            disabled={isGenerating}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
              ${currentTheme === theme 
                ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-white'}
              ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {theme === currentTheme && isGenerating ? 'Generating...' : theme}
          </button>
        ))}
      </div>
    </div>
  );
};