import React from 'react';
import { Palette } from '../types';

interface ExportModalProps {
  palette: Palette;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ palette, onClose, onToast }) => {
  
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      onToast(`Copied ${type} to clipboard!`);
    });
  };

  // --- Export Logic Handlers ---

  const generateCSS = () => {
    let css = `/* ${palette.name} - https://kelemat-pallet.app */\n:root {\n`;
    palette.colors.forEach((c, i) => {
      css += `  --color-${i + 1}: ${c.hex}; /* ${c.name} */\n`;
    });
    css += '}';
    handleCopy(css, 'CSS');
  };

  const generateSCSS = () => {
    let scss = `// ${palette.name}\n`;
    palette.colors.forEach((c, i) => {
      scss += `$color-${i + 1}: ${c.hex}; // ${c.name}\n`;
    });
    handleCopy(scss, 'SCSS Code');
  };

  const generateTailwind = () => {
    const config = {
      theme: {
        extend: {
          colors: {
            [palette.name.toLowerCase().replace(/\s+/g, '-')]: {
              ...palette.colors.reduce((acc, c, i) => ({
                ...acc,
                [(i + 1) * 100]: c.hex
              }), {})
            }
          }
        }
      }
    };
    handleCopy(JSON.stringify(config, null, 2), 'Tailwind Config');
  };

  const generateJSON = () => {
    handleCopy(JSON.stringify(palette, null, 2), 'JSON');
  };

  const generateSVG = () => {
    const width = 1000;
    const height = 200;
    const stripeWidth = width / palette.colors.length;
    
    let rects = '';
    palette.colors.forEach((c, i) => {
      rects += `<rect x="${i * stripeWidth}" y="0" width="${stripeWidth}" height="${height}" fill="${c.hex}" />`;
    });

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
        ${rects}
      </svg>
    `.trim();
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${palette.name.replace(/\s+/g, '-')}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    onToast('SVG Downloaded!');
  };

  const generateImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw Colors
    const stripeWidth = canvas.width / palette.colors.length;
    palette.colors.forEach((c, i) => {
      ctx.fillStyle = c.hex;
      ctx.fillRect(i * stripeWidth, 0, stripeWidth, canvas.height);
      
      // Add Hex text
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(i * stripeWidth, canvas.height - 60, stripeWidth, 60);
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(c.hex, i * stripeWidth + (stripeWidth / 2), canvas.height - 25);
    });

    // Download
    const link = document.createElement('a');
    link.download = `${palette.name.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    onToast('Image Downloaded!');
  };

  const generateURL = () => {
    const params = new URLSearchParams();
    const hexList = palette.colors.map(c => c.hex.replace('#', '')).join('-');
    const url = `${window.location.origin}/palette/${hexList}`;
    handleCopy(url, 'URL');
  };

  const handleShare = async () => {
    const hexList = palette.colors.map(c => c.hex.replace('#', '')).join('-');
    const url = `${window.location.origin}/palette/${hexList}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Kelemat Pallet: ${palette.name}`,
          text: `Check out this color palette: ${palette.description}`,
          url: url,
        });
        onToast('Shared successfully!');
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      generateURL();
    }
  };

  const handlePrintPDF = () => {
    // Create a printable window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      onToast('Please allow popups to print');
      return;
    }

    const colorsHtml = palette.colors.map(c => `
      <div style="flex: 1; height: 200px; background-color: ${c.hex}; display: flex; align-items: center; justify-content: center; color: white; font-family: monospace; font-size: 20px; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
        ${c.hex}<br/>${c.name}
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>${palette.name} - PDF Export</title>
          <style>
            body { font-family: sans-serif; padding: 40px; }
            h1 { margin-bottom: 10px; }
            p { color: #666; margin-bottom: 30px; }
            .palette { display: flex; border: 1px solid #ccc; margin-bottom: 30px; }
            .tags { display: flex; gap: 10px; }
            .tag { background: #eee; padding: 5px 10px; border-radius: 4px; font-size: 12px; }
            .footer { margin-top: 50px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <h1>${palette.name}</h1>
          <p>${palette.description}</p>
          <div class="palette">
            ${colorsHtml}
          </div>
          <div class="tags">
            ${palette.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
          <div class="footer">
            Generated by Kelemat Pallet
          </div>
          <script>
            window.onload = () => { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleTwitter = () => {
    const text = `Check out this amazing color palette "${palette.name}" on Kelemat Pallet! 🎨`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handlePinterest = () => {
    const text = `Color palette: ${palette.name}`;
    const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&description=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // --- UI Configuration ---

  const exportOptions = [
    { 
      name: 'URL', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />, 
      action: generateURL, 
      label: 'Link' 
    },
    { 
      name: 'Share', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />, 
      action: handleShare, 
      label: 'Share' 
    },
    { 
      name: 'PDF', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />, 
      action: handlePrintPDF, 
      label: 'Print' 
    },
    { 
      name: 'Image', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />, 
      action: generateImage, 
      label: 'PNG' 
    },
    { 
      name: 'CSS', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />, 
      action: generateCSS, 
      label: 'Variables' 
    },
    { 
      name: 'JSON', 
      isText: true,
      textIcon: "{ }",
      action: generateJSON, 
      label: 'JSON' 
    },
    { 
      name: 'SVG', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />, 
      action: generateSVG, 
      label: 'Vector' 
    },
    { 
      name: 'Code', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />, 
      action: generateSCSS, 
      label: 'SCSS' 
    },
    { 
      name: 'Tailwind', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />, 
      action: generateTailwind, 
      label: 'Config' 
    },
    { 
      name: 'X', 
      isText: true,
      textIcon: "𝕏",
      action: handleTwitter, 
      label: 'Tweet' 
    },
    { 
      name: 'Pinterest', 
      isText: true,
      textIcon: "P",
      action: handlePinterest, 
      label: 'Pin it' 
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in flex flex-col max-h-[85vh] md:max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-800 bg-gray-900/50 shrink-0">
          <div className="text-center w-full relative">
            <h2 className="text-xl md:text-2xl font-bold text-white">Export Palette</h2>
            <button 
              onClick={onClose}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Palette Preview Strip */}
        <div className="h-16 md:h-24 flex w-full shrink-0">
          {palette.colors.map((c, i) => (
            <div key={i} className="flex-1 h-full flex items-center justify-center group relative" style={{ backgroundColor: c.hex }}>
               <span className="bg-black/20 backdrop-blur-sm text-white text-[10px] md:text-xs font-mono py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                 {c.hex}
               </span>
            </div>
          ))}
        </div>

        {/* Grid Options */}
        <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {exportOptions.map((opt) => (
              <button
                key={opt.name}
                onClick={opt.action}
                className="flex flex-col items-center justify-center py-4 px-2 md:p-6 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-500 rounded-2xl transition-all duration-200 group md:aspect-square"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-4 text-gray-300 group-hover:text-white transition-colors flex items-center justify-center">
                   {opt.isText ? (
                     <span className="text-2xl md:text-3xl font-bold">{opt.textIcon}</span>
                   ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                       {opt.icon}
                     </svg>
                   )}
                </div>
                <span className="text-white font-semibold text-sm md:text-lg">{opt.name}</span>
                <span className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1 group-hover:text-gray-400">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};