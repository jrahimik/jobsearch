import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} JobMatch AI. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Privacy Policy</span>
              <span className="text-sm">Privacy Policy</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Terms of Service</span>
              <span className="text-sm">Terms of Service</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Contact</span>
              <span className="text-sm">Contact</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
