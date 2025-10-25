// src/pages/ProfilePage/components/ProjectsSection.jsx
import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import ProfileStats from './ProfileStats';
import ProjectCard from './ProjectCard';

const ProjectsSection = ({ projects, userId, tasks }) => {
  const [showCompletedProjects, setShowCompletedProjects] = useState(false);

  const filteredProjects = projects.filter(project => 
    showCompletedProjects 
      ? project.projectStatus === 'Completed' 
      : project.projectStatus !== 'Completed'
  );

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Briefcase className="text-blue-500" size={20} />
          Projects & Statistics
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCompletedProjects(false)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              !showCompletedProjects 
                ? 'bg-sky-500 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setShowCompletedProjects(true)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              showCompletedProjects 
                ? 'bg-sky-500 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Completed
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[510px] max-h-[510px] border border-gray-200 p-3 overflow-y-auto">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard 
                  key={project._id} 
                  project={project} 
                  userId={userId}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                No {showCompletedProjects ? 'completed' : 'active'} projects found
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <ProfileStats tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;