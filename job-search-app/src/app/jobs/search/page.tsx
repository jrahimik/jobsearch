"use client";

import { useEffect, useState } from 'react';
import IntegratedJobSearch from '@/components/IntegratedJobSearch';

export default function JobSearchPage() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Retrieve keywords from localStorage
    const storedKeywords = localStorage.getItem('resumeKeywords');
    if (storedKeywords) {
      try {
        const parsedKeywords = JSON.parse(storedKeywords);
        setKeywords(Array.isArray(parsedKeywords) ? parsedKeywords : []);
      } catch (error) {
        console.error('Error parsing stored keywords:', error);
      }
    }
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-lg text-gray-700">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Matches</h1>
          <p className="mt-2 text-sm text-gray-600">
            Found {keywords.length} keywords from your resume
          </p>
          
          {keywords.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Keywords from your resume:</h2>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {keywords.length > 0 ? (
          <IntegratedJobSearch keywords={keywords} />
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No resume uploaded</h3>
              <p className="mt-1 text-sm text-gray-500">
                Please upload your resume to find matching jobs.
              </p>
              <div className="mt-6">
                <a
                  href="/resume/upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Upload Resume
                </a>
              </div>
            </div>
          </div>
        )}
        
        {/* Google AdSense Placeholder */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Advertisement</h3>
              <p className="mt-1 text-sm text-gray-500">
                Google AdSense will be displayed here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
