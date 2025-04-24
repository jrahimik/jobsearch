import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session } = useSession();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
          
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Welcome, {session?.user?.name || 'User'}!</h2>
            <p className="text-gray-600">
              Use JobMatch AI to find jobs that match your skills and experience. Upload your resume to get started.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Upload Resume</h3>
              <p className="text-blue-700 mb-4">
                Upload your resume to find jobs that match your skills and experience.
              </p>
              <Link
                href="/resume/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Upload Resume
              </Link>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-green-900 mb-2">View Job Matches</h3>
              <p className="text-green-700 mb-4">
                View jobs that match your skills and experience based on your uploaded resume.
              </p>
              <Link
                href="/jobs/search"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                View Jobs
              </Link>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Resume Status</h4>
                <p className="mt-2 text-3xl font-semibold text-gray-900">Not Uploaded</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Job Matches</h4>
                <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500">Applications</h4>
                <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>
        
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
