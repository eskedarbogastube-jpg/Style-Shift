import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ComparisonView } from './components/ComparisonView';
import { ControlPanel } from './components/ControlPanel';
import { editImageWithGemini, stripDataUrlPrefix } from './services/geminiService';
import { AppState, ProcessedImage } from './types';
import { Sparkles, Shirt } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [imageData, setImageData] = useState<ProcessedImage>({
    original: '',
    generated: null,
    mimeType: '',
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageSelect = useCallback((base64: string, mimeType: string) => {
    setImageData({
      original: base64,
      generated: null,
      mimeType: mimeType,
    });
    setAppState(AppState.UPLOADING); // Use UPLOADING state to show control panel but reset processing
    setErrorMsg(null);
  }, []);

  const handleGenerate = async (prompt: string) => {
    if (!imageData.original) return;

    setAppState(AppState.PROCESSING);
    setErrorMsg(null);

    try {
      // 1. Prepare data
      const rawBase64 = stripDataUrlPrefix(imageData.original);
      
      // 2. Call API
      const resultBase64 = await editImageWithGemini(rawBase64, imageData.mimeType, prompt);
      
      // 3. Update state
      setImageData(prev => ({ ...prev, generated: resultBase64 }));
      setAppState(AppState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg(err.message || "Failed to generate image. Please try again.");
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setImageData({ original: '', generated: null, mimeType: '' });
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950/20 pb-12">
      {/* Header */}
      <header className="w-full bg-gray-950/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Shirt className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              StyleShift
            </h1>
          </div>
          <div className="flex items-center space-x-4 text-sm font-medium text-gray-400">
             <div className="hidden md:flex items-center space-x-1">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span>Powered by Gemini 2.5</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-8 md:pt-12 space-y-8">
        
        {/* Intro Text (only when IDLE) */}
        {appState === AppState.IDLE && (
          <div className="text-center space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Reimagine Your <span className="text-indigo-500">Wardrobe</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Upload a photo and instantly swap outfits using advanced AI. 
              Turn a t-shirt into a suit, or try on a tuxedo in seconds.
            </p>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center animate-in fade-in">
            <span className="mr-2">⚠️</span>
            {errorMsg}
          </div>
        )}

        {/* Uploader or Comparison */}
        <div className="transition-all duration-500 ease-in-out">
          {appState === AppState.IDLE ? (
            <ImageUploader onImageSelect={handleImageSelect} />
          ) : (
            <ComparisonView 
              originalImage={imageData.original}
              generatedImage={imageData.generated}
              isLoading={appState === AppState.PROCESSING}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Controls (visible when image is selected) */}
        {appState !== AppState.IDLE && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 delay-100">
            <ControlPanel 
              onGenerate={handleGenerate}
              isLoading={appState === AppState.PROCESSING}
              disabled={appState === AppState.PROCESSING}
            />
          </div>
        )}

        {/* Instructions / Features Grid (Only when IDLE) */}
        {appState === AppState.IDLE && (
          <div className="grid md:grid-cols-3 gap-6 mt-16 text-gray-400">
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-indigo-500/30 transition-colors">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-indigo-400 font-bold">1</div>
              <h3 className="text-white font-semibold mb-2">Upload Photo</h3>
              <p className="text-sm">Choose a clear photo of a person. Full body or upper body shots work best.</p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-indigo-500/30 transition-colors">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-indigo-400 font-bold">2</div>
              <h3 className="text-white font-semibold mb-2">Select Style</h3>
              <p className="text-sm">Pick a preset like "Business Suit" or describe exactly what you want to see.</p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-indigo-500/30 transition-colors">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-indigo-400 font-bold">3</div>
              <h3 className="text-white font-semibold mb-2">Transform</h3>
              <p className="text-sm">Watch as AI intelligently replaces the clothing while keeping the pose and face natural.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;