// src/pages/ProfilePage/components/ProjectCard.jsx
import React from 'react';
import { Calendar } from 'lucide-react';

const ProjectCard = ({ project, userId }) => {
  const today = new Date();
  let todo = 0;
  let inProgress = 0;
  let overdue = 0;
  let completed = 0;

  project.todo?.forEach(task => {
    if (task.teamMemberID === userId) {
      const dueDate = new Date(task.enddate);
      dueDate < today ? overdue++ : todo++;
    }
  });

  project.onprogress?.forEach(task => {
    if (task.teamMemberID === userId) {
      const dueDate = new Date(task.enddate);
      dueDate < today ? overdue++ : inProgress++;
    }
  });

  project.review?.forEach(task => {
    if (task.teamMemberID === userId) {
      const dueDate = new Date(task.enddate);
      dueDate < today ? overdue++ : inProgress++;
    }
  });

  project.done?.forEach(task => {
    if (task.teamMemberID === userId) completed++;
  });

  const totalTasks = completed + overdue + inProgress + todo;
  const isOngoing = project.projectStatus !== 'Completed';
  const isTeamLead = project.teamLeadId === userId;

  return (
    <div className={`p-4 border rounded-xl hover:shadow-md transition-shadow ${
      isOngoing ? 'border-blue-200 ' : 'border-gray-200 bg-white'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{project.projectName}</h3>
          <p className="text-sm text-gray-600 mt-1">{project.teamName}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-xs px-2 py-1 rounded-full mb-1 ${
            project.projectStatus === 'Completed' ? 'bg-green-100 text-green-800' :
            project.projectStatus === 'On Hold' ? 'bg-purple-100 text-purple-800' :
            project.projectStatus === 'Not Yet Started' ? 'bg-red-100 text-red-800' :
            'bg-sky-100 text-aky-800'
          }`}>
            {project.projectStatus}
          </span>
          {isTeamLead && (
            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
              Team Lead
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
        <Calendar size={14} />
        <span>{project.projectDuration} months</span>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="font-bold text-green-800 text-sm">{completed}</span>
            </div>
            <span className="text-xs mt-1 text-gray-500">Done</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <span className="font-bold text-red-800 text-sm">{overdue}</span>
            </div>
            <span className="text-xs mt-1 text-gray-500">Overdue</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="font-bold text-blue-800 text-sm">{inProgress}</span>
            </div>
            <span className="text-xs mt-1 text-gray-500">In Progress</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="font-bold text-yellow-800 text-sm">{todo}</span>
            </div>
            <span className="text-xs mt-1 text-gray-500">To Do</span>
          </div>
        </div>
        
        {totalTasks > 0 && (
          <div className="mt-2 text-center text-xs text-gray-500">
            {totalTasks} total assigned tasks.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;