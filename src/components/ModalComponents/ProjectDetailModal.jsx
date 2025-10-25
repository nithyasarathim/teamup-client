import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Users, Clock, Star, Group, UserCheck } from 'lucide-react';
import UserContext from '../../context/UserContext.jsx';
import { toast } from 'react-toastify';

const ProjectDetailModal = ({ project, onClose }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [selectedRole, setSelectedRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const username = user?.username || '';
  const id = user?.id || '';
  const API_URL = import.meta.env.VITE_API_URL;

  const handleNavigate = () => {
    if (project.referenceLink) window.open(project.referenceLink, '_blank');
  };

  const handleAskToJoin = async () => {
    if (!selectedRole) {
      toast.warn('Please select a role before joining!');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      projectName: project.projectName,
      projectId: project._id,
      userId: id,
      username,
      teamLeadId: project.teamLeadId,
      role: selectedRole,
    };

    try {
      const response = await fetch(`${API_URL}/notify/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Request failed');

      toast.success('Request sent successfully!');
      onClose();
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error('Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-2xl"
          >
            <div className="flex justify-between items-center p-6 pb-0">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                  <Group size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{project.projectName}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            
              <div className="space-y-4">
                <InfoRow icon={<Users size={18} />} label="Team" value={project.teamName} />
                <InfoRow icon={<UserCheck size={18} />} label="Team Lead" value={project.teamLeadName} />
                <InfoRow icon={<Clock size={18} />} label="Duration" value={`${project.projectDuration} month${project.projectDuration !== 1 ? 's' : ''}`} />
                <InfoRow icon={<Star size={18} />} label="Status" value={project.projectStatus} status={project.projectStatus} />

                <div>
                  <p className="text-xs text-gray-500 mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {project.referenceLink && (
                  <button
                    onClick={handleNavigate}
                    className="flex items-center gap-2 text-sky-500 hover:text-sky-700 text-sm mt-4"
                  >
                    <ExternalLink size={16} />
                    Explore the Event
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <RoleSelector roles={project.roles} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
                <TeamMembers members={project.teamMembers} teamSize={project.teamSize} navigate={navigate} />
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 flex justify-between items-center">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 max-w-[200px]"
              >
                <option value="">Select a role</option>
                {project.roles.map((role, i) => (
                  <option key={i} value={role}>{role}</option>
                ))}
              </select>

              <button
                onClick={handleAskToJoin}
                disabled={!selectedRole || isSubmitting}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  selectedRole
                    ? 'bg-sky-500 text-white hover:bg-sky-600'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Request to Join'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const InfoRow = ({ icon, label, value, status }) => (
  <div className="flex items-center gap-3">
    <div className="text-gray-500 flex-shrink-0">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      {status ? (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'Active' ? 'bg-green-100 text-green-800' :
          status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      ) : (
        <p className="font-medium">{value}</p>
      )}
    </div>
  </div>
);

const RoleSelector = ({ roles, selectedRole, setSelectedRole }) => (
  <div>
    <p className="text-xs text-gray-500 mb-2">Open Roles</p>
    <div className="space-y-2">
      {roles.map((role, i) => (
        <div 
          key={i}
          className={`flex justify-between items-center p-2 rounded-lg ${
            selectedRole === role ? 'bg-indigo-50 border border-indigo-100' : 'bg-gray-50'
          }`}
        >
          <span className="text-sm font-medium">{role}</span>
          <button
            onClick={() => setSelectedRole(role)}
            className={`text-xs px-2 py-1 rounded ${
              selectedRole === role
                ? 'bg-green-400 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {selectedRole === role ? 'Selected' : 'Select'}
          </button>
        </div>
      ))}
    </div>
  </div>
);

const TeamMembers = ({ members, teamSize, navigate }) => (
  <div>
    <p className="text-xs text-gray-500 mb-2">Team Members ({members.length}/{teamSize})</p>
    <div className="flex flex-wrap gap-2">
      {members.slice(0, 5).map((member, i) => (
        <div 
          key={i}
          onClick={() => navigate(`/profile/${member.userid}`)}
          className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-gray-100"
        >
          <div 
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
            style={{ backgroundColor: stringToColor(member.name) }}
          >
            {member.name.charAt(0)}
          </div>
          <span>{member.name.split(' ')[0]}</span>
          {member.role && (
            <span className="ml-1 px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
              {member.role}
            </span>
          )}
        </div>
      ))}
      {members.length > 5 && (
        <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
          +{members.length - 5}
        </div>
      )}
    </div>
  </div>
);

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
}

export default ProjectDetailModal;
