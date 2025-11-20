import React from 'react';
import { Palette, Color } from '../types';

interface PaletteCardProps {
  palette: Palette;
  onCopy: (color: string) => void;
  onExport: (palette: Palette) => void;
}

// Helper to decide text color based on background brightness
const getContrastYIQ = (hexcolor: string) => {
  hexcolor = hexcolor.replace('#', '');
  const r = parseInt(hexcolor.substring(0, 2), 16);
  const g = parseInt(hexcolor.substring(2, 4), 16);
  const b = parseInt(hexcolor.substring(4, 6), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? 'text-black' : 'text-white';
};

export const PaletteCard: React.FC<PaletteCardProps> = ({ palette, onCopy, onExport }) => {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-700 hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-300 group flex flex-col h-full">
      
      {/* Color Strips */}
      <div className="h-40 md:h-48 flex w-full cursor-pointer">
        {palette.colors.map((color, idx) => (
          <div
            key={idx}
            onClick={() => onCopy(color.hex)}
            className="h-full flex-1 relative group/color transition-all hover:flex-[2] flex items-end justify-center pb-4"
            style={{ backgroundColor: color.hex }}
            title={`${color.name} (${color.hex})`}
          >
            <span className={`text-xs font-mono font-bold opacity-0 group-hover/color:opacity-100 transition-opacity ${getContrastYIQ(color.hex)}`}>
              {color.hex}
            </span>
          </div>
        ))}
      </div>

      {/* Meta Data */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
              {palette.name}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">{palette.description}</p>
          </div>
          
          <div className="flex items-center gap-1">
             <button 
              onClick={() => onExport(palette)}
              className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all" 
              aria-label="Export"
              title="Export Palette"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
            </button>
            <button 
              className="p-2 text-gray-500 hover:text-pink-500 hover:bg-gray-800 rounded-lg transition-all" 
              aria-label="Like"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-auto pt-4 flex flex-wrap gap-2">
          {palette.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded-md border border-gray-700">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center text-xs text-gray-500 font-mono">
          <span>{palette.colors.length} colors</span>
          <span>{palette.likes} likes</span>
        </div>
      </div>
    </div>
  );
};