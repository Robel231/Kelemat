import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Generator } from './components/Generator';
import { PaletteCard } from './components/PaletteCard';
import { ExportModal } from './components/ExportModal';
import { Toast } from './components/Toast';
import { generatePalettes } from './services/geminiService';
import { Palette, GenerationTheme, ToastMessage } from './types';

const App: React.FC = () => {
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<string>(GenerationTheme.TRENDING);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // State for export modal
  const [exportingPalette, setExportingPalette] = useState<Palette | null>(null);
  
  // Ref for infinite scrolling
  const observerTarget = useRef<HTMLDivElement>(null);

  // Helper to add toast
  const addToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, text, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Copy handler
  const handleCopy = useCallback((color: string) => {
    navigator.clipboard.writeText(color).then(() => {
      addToast(`Copied ${color} to clipboard!`);
    });
  }, [addToast]);

  // Fetch palettes
  const fetchPalettes = useCallback(async (theme: string, reset: boolean = false) => {
    setLoading(true);
    setCurrentTheme(theme);
    
    try {
      // Generate 8 at a time to fill grid
      const newPalettes = await generatePalettes(theme, 8);
      setPalettes(prev => reset ? newPalettes : [...prev, ...newPalettes]);
    } catch (e) {
      addToast('Failed to generate palettes. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Initial load
  useEffect(() => {
    fetchPalettes(GenerationTheme.TRENDING, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && palettes.length > 0) {
          fetchPalettes(currentTheme, false);
        }
      },
      { threshold: 0.1, rootMargin: '200px' } // Load 200px before reaching bottom
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, palettes.length, currentTheme, fetchPalettes]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Hero Section */}
        <div className="py-10 md:py-16 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white tracking-tight">
            The Infinite <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Color Library</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg px-2">
            Generate, explore, and export thousands of AI-crafted color palettes. 
            Built for frontend developers who need inspiration instantly.
          </p>
        </div>

        {/* Generator Controls */}
        <div className="mb-8 sticky top-16 z-40 bg-gray-950/90 backdrop-blur-sm py-2 border-b border-gray-800/50 -mx-4 px-4 sm:mx-0 sm:px-0">
           <Generator 
             currentTheme={currentTheme} 
             isGenerating={loading} 
             onGenerate={(theme) => fetchPalettes(theme, true)} 
           />
        </div>

        {/* Palette Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {palettes.map((palette) => (
            <div key={palette.id} className="animate-fade-in">
              <PaletteCard 
                palette={palette} 
                onCopy={handleCopy} 
                onExport={setExportingPalette}
              />
            </div>
          ))}
          
          {/* Skeletons for loading state */}
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="bg-gray-900 rounded-2xl border border-gray-800 h-80 animate-pulse p-5 flex flex-col">
              <div className="h-32 bg-gray-800 rounded-lg mb-4 w-full"></div>
              <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-800 rounded w-1/2 mb-auto"></div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-800 rounded"></div>
                <div className="h-6 w-16 bg-gray-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Infinite Scroll Sentinel */}
        <div ref={observerTarget} className="h-10 w-full mt-4" aria-hidden="true" />
        
      </main>
      
      <footer className="border-t border-gray-900 py-8 text-center mt-auto bg-gray-950 px-4">
         <p className="text-gray-500 font-medium text-sm md:text-base">Developed by <span className="text-purple-400 hover:text-purple-300 transition-colors cursor-default">Robel Shemeles</span></p>
      </footer>

      {/* Export Modal */}
      {exportingPalette && (
        <ExportModal 
          palette={exportingPalette} 
          onClose={() => setExportingPalette(null)} 
          onToast={(msg) => addToast(msg, 'info')}
        />
      )}

      {/* Toasts Container - Mobile friendly: Centered bottom on mobile, Bottom right on desktop */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:bottom-6 md:right-6 z-50 flex flex-col items-center md:items-end pointer-events-none gap-2">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
};

export default App;