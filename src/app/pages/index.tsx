/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/index.tsx
"use client"
import { useState } from 'react';
import type { NextPage } from 'next';

const Homes: NextPage = () => {
  const [fileContent, setFileContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    const fileInput = e.currentTarget.elements.namedItem('file') as HTMLInputElement;
    
    if (fileInput.files && fileInput.files.length > 0) {
      formData.append('file', fileInput.files[0]);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const { text } = await response.json();
          setFileContent(text);
          setError(null);
        } else {
          const errorData = await response.json();
          setError(errorData.error);
          setFileContent('');
        }
      } catch (error) {
        setError('An error occurred while uploading the file');
        setFileContent('');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form onSubmit={handleFileUpload} className="w-full max-w-md">
        <div className="flex items-center border-b border-teal-500 py-2">
          <input 
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" 
            type="file" 
            name="file" 
            required 
          />
          <button 
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" 
            type="submit"
          >
            Upload and Extract Text
          </button>
        </div>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {fileContent && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold">Extracted Text:</h2>
          <pre className="bg-gray-100 rounded p-4 mt-2">{fileContent}</pre>
        </div>
      )}
    </div>
  );
};

export default Homes;