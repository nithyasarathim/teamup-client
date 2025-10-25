import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserContext from '../../context/UserContext.jsx';
import { X } from 'lucide-react';

const DiscussModal = ({ setShowDiscuss, showAddProjectModal }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const userId = user?.id || '';

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/projects/my-projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: userId }),
        });
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };

    fetchProjects();
  }, [showAddProjectModal, userId]);

  const handleProjectClick = (id) => {
    setShowDiscuss(false);
    navigate(`/discussion/${id}`);
  };

  return (
    <div className="fixed inset-0 bg-[#00000099] z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full max-w-6xl p-6 rounded-xl shadow-lg max-h-[90vh] overflow-y-auto relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h1 className="text-xl font-semibold text-sky-600">Select a Project</h1>
          <button
            onClick={() => setShowDiscuss(false)}
            className="text-gray-500 hover:text-black p-2 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="flex items-center justify-center h-[50vh] w-full text-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-1">
                No project discussions available
              </h2>
              <p className="text-sm text-gray-500">
                You are not part of any project yet. Join a project to start discussions and
                collaborate with your team.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const totalIssues =
                (project.todo?.length || 0) +
                (project.onprogress?.length || 0) +
                (project.review?.length || 0);

              return (
                <div
                  key={index}
                  onClick={() => handleProjectClick(project._id)}
                  className="bg-white shadow-md p-5 hover:shadow-lg transition duration-300 rounded-lg cursor-pointer relative"
                >
                  <div className="mb-2">
                    <h2 className="text-md font-bold text-black">{project.projectName}</h2>
                  </div>

                  <table className="w-full border-collapse text-sm text-gray-700">
                    <tbody>
                      <tr className="border-t border-gray-200">
                        <td className="py-2 font-medium">Project Type</td>
                        <td className="py-2 text-right">
                          <span className="bg-teal-100 text-gold px-2 py-1 rounded-lg text-sm font-semibold">
                            {project.projectType}
                          </span>
                        </td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="py-2 font-medium">Team</td>
                        <td className="py-2 text-right">{project.teamName}</td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="py-2 font-medium">Team Lead</td>
                        <td className="py-2 text-right">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm font-semibold">
                            {project.teamLeadName}
                          </span>
                        </td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="py-2 font-medium">Duration</td>
                        <td className="py-2 text-right">
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg text-xs font-medium">
                            {project.projectDuration} months
                          </span>
                        </td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="py-2 font-medium">Status</td>
                        <td className="py-2 text-right">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg text-xs font-medium">
                            {project.projectStatus}
                          </span>
                        </td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="py-2 font-medium">Total Issues</td>
                        <td className="py-2 text-right">
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-lg text-xs font-medium">
                            {totalIssues} total issues
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DiscussModal;
