import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (base64: string, mimeType: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onImageSelect(result, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  return (
    <div
      className={`relative w-full h-96 rounded-2xl border-4 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-500/10' 
          : 'border-gray-700 bg-gray-800/50 hover:border-indigo-400 hover:bg-gray-800'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div className="flex flex-col items-center text-center p-6 space-y-4">
        <div className={`p-4 rounded-full bg-gray-700 group-hover:bg-indigo-600 transition-colors duration-300 shadow-lg`}>
          <Upload className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Upload a Photo</h3>
          <p className="text-gray-400 max-w-sm">
            Drag & drop an image here, or click to select from your device.
            <br />
            <span className="text-sm text-gray-500 mt-2 block">Supports JPG, PNG, WEBP</span>
          </p>
        </div>
      </div>

      {/* Example badge */}
      <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-600/80 rounded-full text-xs font-semibold text-white backdrop-blur-sm">
        AI Powered
      </div>
    </div>
  );
};