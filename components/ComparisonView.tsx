import React, { useState } from 'react';
import { Download, ArrowLeftRight, Maximize2 } from 'lucide-react';

interface ComparisonViewProps {
  originalImage: string;
  generatedImage: string | null;
  isLoading: boolean;
  onReset: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ 
  originalImage, 
  generatedImage, 
  isLoading,
  onReset 
}) => {
  const [activeTab, setActiveTab] = useState<'original' | 'generated' | 'split'>('split');

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `styleshift-edit-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* View Controls */}
      <div className="flex justify-between items-center bg-gray-800/50 p-2 rounded-xl backdrop-blur-sm">
        <div className="flex space-x-2">
           <button 
            onClick={() => setActiveTab('original')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'original' ? 'bg-gray-700 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Original
          </button>
          <button 
            onClick={() => setActiveTab('generated')}
            disabled={!generatedImage && !isLoading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'generated' ? 'bg-gray-700 text-white shadow-md' : 'text-gray-400 hover:text-white disabled:opacity-30'}`}
          >
            Result
          </button>
           <button 
            onClick={() => setActiveTab('split')}
            disabled={!generatedImage && !isLoading}
            className={`hidden md:block px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'split' ? 'bg-gray-700 text-white shadow-md' : 'text-gray-400 hover:text-white disabled:opacity-30'}`}
          >
            Split View
          </button>
        </div>

        <div className="flex space-x-2">
          {generatedImage && (
            <button 
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          )}
          <button 
            onClick={onReset}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-semibold"
          >
            New Upload
          </button>
        </div>
      </div>

      {/* Image Display Area */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex items-center justify-center">
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-950/80 backdrop-blur-sm">
             <div className="relative w-24 h-24">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/30 rounded-full animate-ping"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
             </div>
             <p className="mt-6 text-xl font-medium text-indigo-300 animate-pulse">Generating your new look...</p>
             <p className="mt-2 text-sm text-gray-500">This usually takes 5-10 seconds</p>
          </div>
        )}

        {/* Content based on Tab */}
        <div className="w-full h-full flex items-center justify-center p-4">
          
          {activeTab === 'original' && (
            <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
          )}

          {activeTab === 'generated' && (
            generatedImage ? (
              <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain rounded-lg shadow-lg ring-2 ring-indigo-500/50" />
            ) : (
              <div className="text-gray-500">Waiting for generation...</div>
            )
          )}

          {activeTab === 'split' && (
            <div className="grid grid-cols-2 gap-4 w-full h-full">
              <div className="relative h-full bg-gray-800/50 rounded-lg overflow-hidden flex items-center justify-center">
                <span className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-xs text-white rounded backdrop-blur-md z-10">Original</span>
                <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="relative h-full bg-gray-800/50 rounded-lg overflow-hidden flex items-center justify-center border border-indigo-500/20">
                <span className="absolute top-2 right-2 px-2 py-1 bg-indigo-600/80 text-xs text-white rounded backdrop-blur-md z-10">Result</span>
                {generatedImage ? (
                   <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center text-gray-600">
                    <Maximize2 className="w-8 h-8 mb-2 opacity-50" />
                    <span>Processing...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};