// src/pages/ProfilePage/components/ProfileHeader.jsx
import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const ProfileHeader = ({ user }) => {
  return (
    <div className="bg-white rounded-xl mb-2">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative">
          <div className="h-60 w-60 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center">
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-blue-200 flex items-center justify-center text-blue-500">
                <span className="text-4xl font-bold">{user.username.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="bg-white p-4 rounded-lg w-full">
              <div className='flex items-center gap-4 w-full'>
                <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  user.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.isAvailable ? 'Available' : 'Not Available'}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                  Department of {user.department}
                </span>
                <span className="text-sm bg-sky-100 text-gray-800 px-2 py-1 rounded-full">
                  2023 - 27
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              {user.githubUrl && (
                <a 
                  href={user.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  data-tooltip-id="github-tooltip"
                  data-tooltip-content="GitHub Profile"
                >
                  <Github className="text-gray-700" size={20} />
                </a>
              )}
              {user.linkedinUrl && (
                <a 
                  href={user.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                  data-tooltip-id="linkedin-tooltip"
                  data-tooltip-content="LinkedIn Profile"
                >
                  <Linkedin className="text-blue-700" size={20} />
                </a>
              )}
              <button 
                className="p-3 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
                data-tooltip-id="contact-tooltip"
                data-tooltip-content="Contact User"
              >
                <Mail className="text-green-700" size={20} />
              </button>
            </div>
          </div>
          
          <div className="mt-2 space-y-4">
            {user.description && (
              <div className="p-4 bg-white rounded-lg">
                <p className="text-gray-700">{user.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {user.skills?.length > 0 && (
        <div className="p-4 bg-white rounded-lg mt-3">
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;