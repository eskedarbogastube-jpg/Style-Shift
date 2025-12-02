import React, { useState, useEffect } from 'react';
import { Wand2, AlertCircle } from 'lucide-react';
import { PRESET_STYLES, DEFAULT_PROMPT } from '../constants';

interface ControlPanelProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onGenerate, isLoading, disabled }) => {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [selectedPreset, setSelectedPreset] = useState<string>('suit-dark');

  const handlePresetClick = (presetId: string, presetPrompt: string) => {
    setSelectedPreset(presetId);
    setPrompt(presetPrompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate(prompt);
  };

  // Sync initial preset with default prompt if needed, or just leave as is.
  useEffect(() => {
    const found = PRESET_STYLES.find(p => p.prompt === prompt);
    if (found) {
      setSelectedPreset(found.id);
    } else {
      setSelectedPreset('');
    }
  }, [prompt]);

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Wand2 className="w-5 h-5 mr-2 text-indigo-400" />
          Choose a Style
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {PRESET_STYLES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset.id, preset.prompt)}
              disabled={disabled || isLoading}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200
                ${selectedPreset === preset.id 
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg scale-105' 
                  : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                }
                ${(disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="text-2xl mb-1">{preset.icon}</span>
              <span className="text-xs font-medium text-center leading-tight">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-400 mb-2">
            Or describe custom clothing
          </label>
          <div className="relative">
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={disabled || isLoading}
              rows={3}
              className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 resize-none"
              placeholder="e.g., Change the person's outfit to a red summer dress..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={disabled || isLoading || !prompt.trim()}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all
            ${disabled || isLoading || !prompt.trim()
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 active:scale-[0.99]'
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              <span>Processing Image...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Generate New Look</span>
            </>
          )}
        </button>
      </form>
      
      <div className="mt-4 flex items-start space-x-2 text-xs text-gray-500 bg-gray-900/50 p-3 rounded-lg">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          Generative AI can sometimes produce unexpected results. For best results, use clear, high-quality photos where the subject is visible.
        </p>
      </div>
    </div>
  );
};