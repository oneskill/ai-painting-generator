'use client';

import { useState } from 'react';

const themes = ['Nature', 'Urban', 'Abstract', 'Historical', 'Surreal', 'Futurism', 'Landscape' ];

export default function Home() {
  const [selectedTheme, setSelectedTheme] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [paintingLoading, setPaintingLoading] = useState(false);
  const [generatedPainting, setGeneratedPainting] = useState('');
  const [paintingParams, setPaintingParams] = useState({
    size: '1024x1024',
    quality: 'standard',
    style: 'vivid',
  });

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
  };

  const generateDescription = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: selectedTheme }),
      });
      const data = await response.json();
      setDescription(data.description);
    } catch (error) {
      console.error('Error generating description:', error);
    }
    setLoading(false);
  };

  const generatePainting = async () => {
    setPaintingLoading(true);
    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, ...paintingParams }), 
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setGeneratedPainting(data.imageUrl);
    } catch (error) {
      console.error('Error generating painting:', error);
    } finally {
      setPaintingLoading(false);
    }
  };

  const resetAll = () => {
    if (window.confirm("Are you sure you want to reset everything? This will clear all selections and generated content.")) {
      setSelectedTheme('');
      setDescription('');
      setGeneratedPainting('');
      setPaintingParams({
        size: '1024x1024',
        quality: 'standard',
        style: 'vivid',
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <div className="w-1/2 p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-2">AI Painting Generator</h1>
        <p className="mb-6 text-gray-400">Customize your painting with various parameters.</p>
        
        <div className="mb-4">
          <label className="block mb-2">Theme</label>
          <div className="flex gap-2">
            <select 
              value={selectedTheme} 
              onChange={(e) => handleThemeSelect(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded p-2 flex-grow"
            >
              <option value="">Select a theme</option>
              {themes.map(theme => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
            <button 
              onClick={generateDescription}
              disabled={!selectedTheme || loading}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-600"
            >
              Generate Description
            </button>
          </div>
        </div>

        <div className="mb-6 relative">
          <label className="block mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2"
            rows={8}
            placeholder="Enter a description for your painting"
            disabled={loading}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="loader"></div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-2">Painting Parameters</label>
          <div className="grid grid-cols-3 gap-2">
            <select
              value={paintingParams.size}
              onChange={(e) => setPaintingParams({ ...paintingParams, size: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded p-2"
            >
              <option value="256x256">256x256</option>
              <option value="512x512">512x512</option>
              <option value="1024x1024">1024x1024</option>
            </select>
            <select
              value={paintingParams.quality}
              onChange={(e) => setPaintingParams({ ...paintingParams, quality: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded p-2"
            >
              <option value="standard">Standard</option>
              <option value="hd">HD</option>
            </select>
            <select
              value={paintingParams.style}
              onChange={(e) => setPaintingParams({ ...paintingParams, style: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded p-2"
            >
              <option value="vivid">Vivid</option>
              <option value="natural">Natural</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button 
            onClick={generatePainting}
            disabled={!description || paintingLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded flex-grow disabled:bg-gray-600"
          >
            Generate Painting
          </button>
          <button 
            onClick={resetAll}
            className="bg-red-600 text-white px-6 py-2 rounded"
          >
            Reset All
          </button>
        </div>
      </div>

      <div className="w-1/2 bg-gray-800 p-8 flex items-center justify-center relative">
        {generatedPainting ? (
          <img src={generatedPainting} alt="Generated painting" className="max-w-full max-h-full object-contain" />
        ) : paintingLoading ? (
          <div className="loader"></div>
        ) : (
          <div className="text-center text-gray-500">
            <svg className="w-24 h-24 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Your generated painting will appear here</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}