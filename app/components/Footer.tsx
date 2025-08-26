'use client';

import { Users, Award, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-2">☁️</div>
              <h3 className="text-lg font-semibold">AWS Learning Platform</h3>
            </div>
            <p className="text-gray-400 mb-4">
              The AWS Learning Hub was created by Group 2 - AWS Navigators as part of an AWS re/Start class project. 
              Built by students for students, this platform demonstrates the power of cloud technologies while making 
              AWS learning more accessible and engaging for everyone.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Users className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Award className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Zap className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Learning</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Topics</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Tutorials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Games</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Flashcards</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Topics</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Networking</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Compute</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Storage</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Security</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Feedback</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 AWS Learning Hub - Group 2 AWS Navigators 🐊
          </p>
        </div>
      </div>
    </footer>
  );
}
