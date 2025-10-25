import React from 'react';
import { Figma, Github } from 'lucide-react';
import GroupDiscussion from './../../assets/GroupDiscussion.png';

const DiscussStatistics = ({teamMembers, projectName}) => {

  return (
    <div className='col-span-2 p-2 h-[100%] border border-gray-300 rounded-lg shadow-md bg-white'>
      <h1 className='text-xl font-semibold text-sky-600 border-b border-sky-600 mt-2'>{projectName}</h1>

      <div className='flex'>
        <img src={GroupDiscussion} alt="Group Discussion" className='w-[80%] m-auto h-[80%] rounded-lg' />
      </div>

      <div className='mt-4 px-2'>
        <div className='flex justify-between items-center mb-2'>
          <h2 className='text-lg font-medium text-gray-700'>Current Team</h2>
          <div className='flex items-center space-x-2'>
            <a
              href='https://github.com'
              target='_blank'
              rel='noopener noreferrer'
              className='bg-gray-200 hover:bg-gray-300 p-2 rounded-full'
            >
              <Github className='w-4 h-4 text-gray-700' />
            </a>
            <a
              href='https://figma.com'
              target='_blank'
              rel='noopener noreferrer'
              className='bg-gray-200 hover:bg-gray-300 p-2 rounded-full'
            >
              <Figma className='w-4 h-4 text-gray-700' />
            </a>
            <button className='text-sm bg-sky-500 text-white px-3 py-1 rounded-md hover:bg-sky-700 transition-all duration-200'>
              Manage
            </button>
          </div>
        </div>

        <ul className='no-scrollbar space-y-2 p-3 bg-gray-100 overflow-y-auto max-h-[200px]'>
          {teamMembers.map((member, index) => (
            <li
              key={index}
              className='flex justify-between items-center bg-white px-3 py-2 rounded-md'
            >
              <span className='text-gray-800 text-sm font-medium'>{member.name}</span>
              <span className='bg-sky-100 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full'>
                {member.role}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DiscussStatistics;
