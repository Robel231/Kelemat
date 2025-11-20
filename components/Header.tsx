import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-950/80 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Custom Logo SVG */}
            <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1 w-8 h-8 sm:w-[42px] sm:h-[42px]">
                {/* Segment 1: Red/Maroon (Bottom Left) */}
                <path d="M10 50 A 40 40 0 0 1 23 25" stroke="#C53030" strokeWidth="16" strokeLinecap="butt" />
                
                {/* Segment 2: Orange (Top Left) */}
                <path d="M26 22 A 40 40 0 0 1 50 10" stroke="#DD6B20" strokeWidth="16" strokeLinecap="butt" />
                
                {/* Segment 3: Yellow (Top Right) */}
                <path d="M53 10 A 40 40 0 0 1 77 22" stroke="#F6E05E" strokeWidth="16" strokeLinecap="butt" />
                
                {/* Segment 4: Teal (Bottom Right) */}
                <path d="M80 25 A 40 40 0 0 1 93 53" stroke="#319795" strokeWidth="16" strokeLinecap="butt" />
            </svg>
            
            <div className="flex flex-col justify-center -space-y-1">
                <span className="text-xl sm:text-2xl font-bold tracking-wider text-white font-sans leading-none">
                  KELEMAT
                </span>
                <span className="text-[8px] sm:text-[10px] tracking-[0.2em] text-gray-400 font-medium uppercase pl-0.5">
                  Color Palettes
                </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-4 text-sm font-medium text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Explore</a>
              <a href="#" className="hover:text-white transition-colors">Trending</a>
              <a href="#" className="hover:text-white transition-colors">Saved</a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};