"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string;
  match_score: number;
  date_posted: string;
  keywords_matched: string[];
  application_url: string;
  application_urls: {
    indeed: string;
    linkedin: string;
    glassdoor: string;
    monster: string;
  };
}

interface IntegratedJobSearchProps {
  keywords: string[];
}

export default function IntegratedJobSearch({ keywords }: IntegratedJobSearchProps) {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        
        if (!keywords || keywords.length === 0) {
          setError('No keywords provided. Please upload your resume first.');
          setIsLoading(false);
          return;
        }
        
        const response = await fetch('/api/jobs/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ keywords }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch job matches');
        }
        
        const data = await response.json();
        setJobs(data.jobs || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to fetch job matches. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, [keywords]);
  
  const handleDownloadCSV = () => {
    // Convert jobs to CSV format
    const headers = ['Title', 'Company', 'Location', 'Salary', 'Match Score', 'Posted Date', 'Application URL'];
    const csvRows = [
      headers.join(','),
      ...jobs.map(job => [
        `"${job.title}"`,
        `"${job.company}"`,
        `"${job.location}"`,
        `"${job.salary}"`,
        job.match_score,
        job.date_posted,
        `"${job.application_url}"`
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'job_matches.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleUploadNewResume = () => {
    router.push('/resume/upload');
  };
  
  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg text-gray-700">Searching for matching jobs...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <div className="mt-4">
            <button
              onClick={handleUploadNewResume}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Upload Resume
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Jobs Matching Your Resume
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleUploadNewResume}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Upload New Resume
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Download CSV
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Found {jobs.length} jobs matching your skills and experience
      </p>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salary
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Match
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posted
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{job.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{job.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{job.salary}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${job.match_score >= 90 ? 'bg-green-100 text-green-800' : 
                      job.match_score >= 80 ? 'bg-green-100 text-green-800' : 
                        job.match_score >= 70 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                    {job.match_score}% Match
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {job.date_posted}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="dropdown relative inline-block">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">
                      <a href={job.application_url} target="_blank" rel="noopener noreferrer">
                        Apply
                      </a>
                    </button>
                    <div className="dropdown-content hidden absolute right-0 bg-white shadow-lg rounded-md p-2 z-10 min-w-[150px] group-hover:block">
                      <div className="py-1">
                        <a href={job.application_urls.indeed} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Indeed
                        </a>
                        <a href={job.application_urls.linkedin} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          LinkedIn
                        </a>
                        <a href={job.application_urls.glassdoor} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Glassdoor
                        </a>
                        <a href={job.application_urls.monster} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Monster
                        </a>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {jobs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Job Details</h3>
          {jobs.map((job) => (
            <div key={`details-${job.id}`} className="mb-6 p-4 border border-gray-200 rounded-md">
              <h4 className="text-lg font-medium text-gray-900">{job.title} at {job.company}</h4>
              <p className="text-sm text-gray-600 mt-1">{job.location} | {job.salary}</p>
              
              <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-900">Description</h5>
                <p className="text-sm text-gray-600 mt-1">{job.description}</p>
              </div>
              
              <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-900">Requirements</h5>
                <p className="text-sm text-gray-600 mt-1">{job.requirements}</p>
              </div>
              
              <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-900">Matching Skills</h5>
                <div className="flex flex-wrap gap-1 mt-1">
                  {job.keywords_matched.map((keyword, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <a
                  href={job.application_urls.indeed}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Apply on Indeed
                </a>
                <a
                  href={job.application_urls.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Apply on LinkedIn
                </a>
                <a
                  href={job.application_urls.glassdoor}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Apply on Glassdoor
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
