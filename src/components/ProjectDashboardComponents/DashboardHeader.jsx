import { Figma, Github, RefreshCw, X, Pencil } from 'lucide-react';
import React, { useState, useEffect, useContext } from 'react';
import AddTaskModal from '../ModalComponents/AddTaskModal';
import { toast } from 'react-toastify';
import Select from 'react-select';
import UserContext from '../../context/UserContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ data, setRefresh, refresh }) => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [projectStatus, setProjectStatus] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [prototypeLink, setPrototypeLink] = useState('');
  const [referenceLink, setReferenceLink] = useState('');
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [rolesRequired, setRolesRequired] = useState([]);

  const navigate = useNavigate();
  const user = useContext(UserContext);
  const leadId = data?.teamLeadId;
  const userId = user?.user?.id;
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (showLinkModal && data) {
      setProjectStatus(data.projectStatus || '');
      setProjectLink(data.projectLink || '');
      setPrototypeLink(data.prototypeLink || '');
      setReferenceLink(data.referenceLink || '');
      setSkillsRequired(data.skills || []);
      setRolesRequired(data.roles || []);
    }
  }, [showLinkModal, data]);

  const isGithubMissing = !data?.projectLink;
  const isFigmaMissing = !data?.prototypeLink;

  const handleOpenLink = (url) => {
    if (!url) {
      setShowLinkModal(true);
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubmitProjectUpdate = async () => {
    const payload = {
      projectStatus,
      projectLink,
      prototypeLink,
      referenceLink,
      skillsRequired,
      rolesRequired,
    };

    try {
      await fetch(`${API_URL}/projects/info/${data._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      toast.success('Project info updated!');
      setShowLinkModal(false);
      setRefresh(!refresh);
    } catch (err) {
      toast.error('Update failed. Try again.');
      console.error(err);
    }
  };

  return (
    <div className="w-full bg-white p-4 flex items-center justify-between shadow-sm">
      <h1 className="text-xl font-bold mx-4">
        {data?.projectName || 'Project Name'}
      </h1>

      <div className="flex items-center gap-4">
        {/* Refresh */}
        <div
          className="p-2 rounded-full bg-sky-50 hover:bg-sky-100 hover:rotate-90 hover:duration-300 cursor-pointer"
          onClick={() => setRefresh(!refresh)}
        >
          <RefreshCw className="text-sky-900" size={20} />
        </div>

        {/* Action Buttons */}
        <button
          className="px-4 py-1 bg-sky-50 text-sm rounded-lg hover:bg-sky-100"
          onClick={() => navigate(`/discussion/${data._id}`)}
        >
          Discuss
        </button>
        <button className="px-4 py-1 bg-sky-50 text-sm rounded-lg hover:bg-sky-100">
          Backlog
        </button>
        <button
          className="px-4 py-1 bg-sky-50 text-sm rounded-lg hover:bg-sky-100"
          onClick={() => handleOpenLink(data?.referenceLink)}
        >
          Motive
        </button>

        {/* Github & Figma */}
        <div
          className={`p-2 rounded-full flex text-sm gap-2 ${
            isGithubMissing ? 'bg-gray-200 text-gray-500' : 'bg-sky-50 hover:bg-sky-100 cursor-pointer'
          }`}
          onClick={() => handleOpenLink(data?.projectLink)}
        >
          <Github size={20} /> Github
        </div>

        <div
          className={`p-2 rounded-full flex text-sm gap-2 ${
            isFigmaMissing ? 'bg-gray-200 text-gray-500' : 'bg-sky-50 hover:bg-sky-100 cursor-pointer'
          }`}
          onClick={() => handleOpenLink(data?.prototypeLink)}
        >
          <Figma size={20} /> Figma
        </div>

        {/* Leader Access */}
        {leadId === userId && (
          <div className="leader-access flex gap-2 p-2 border border-gray-200 rounded-md bg-gradient-to-r from-sky-50 via-white to-sky-50 shadow-sm">
            <button
              className="px-4 py-1 bg-sky-100 text-sm text-sky-900 font-medium rounded-lg hover:bg-sky-200 transition-colors duration-200"
              onClick={() => setShowAddTaskModal(true)}
            >
              Add Task
            </button>
            <button
              className="p-2 bg-white border border-gray-300 rounded-full hover:bg-gray-100 hover:shadow transition-all duration-200"
              onClick={() => setShowLinkModal(true)}
            >
              <Pencil className="text-gray-700" size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTaskModal && (
          <motion.div
            key="taskModal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center"
          >
            <AddTaskModal data={data} setShowAddTaskModal={setShowAddTaskModal} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Project Info Modal */}
      <AnimatePresence>
        {showLinkModal && (
          <motion.div
            key="linkModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-[#00000090] bg-opacity-40 z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-lg w-[450px]"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Update Project Info</h2>
                <X
                  className="text-red-500 cursor-pointer"
                  size={20}
                  onClick={() => setShowLinkModal(false)}
                />
              </div>

              <select
                value={projectStatus}
                onChange={(e) => setProjectStatus(e.target.value)}
                className="w-full border px-3 py-2 rounded text-sm mb-3"
              >
                <option value="">-- Select Project Status --</option>
                <option value="Not Yet Started">Not Yet Started</option>
                <option value="On Progress">On Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>

              <input
                type="text"
                placeholder="GitHub Link"
                value={projectLink}
                onChange={(e) => setProjectLink(e.target.value)}
                className="w-full border px-3 py-2 rounded text-sm mb-3"
              />

              <input
                type="text"
                placeholder="Figma Link"
                value={prototypeLink}
                onChange={(e) => setPrototypeLink(e.target.value)}
                className="w-full border px-3 py-2 rounded text-sm mb-3"
              />

              <input
                type="text"
                placeholder="Motive Link"
                value={referenceLink}
                onChange={(e) => setReferenceLink(e.target.value)}
                className="w-full border px-3 py-2 rounded text-sm mb-3"
              />

              <Select
                isMulti
                name="skills"
                options={skillOptions}
                value={skillsRequired.map(skill => ({ value: skill, label: skill }))}
                onChange={(selected) => setSkillsRequired(selected.map((s) => s.value))}
                className="mb-3 text-sm"
                classNamePrefix="select"
              />

              <Select
                isMulti
                name="roles"
                options={roleOptions}
                value={rolesRequired.map(role => ({ value: role, label: role }))}
                onChange={(selected) => setRolesRequired(selected.map((r) => r.value))}
                className="mb-4 text-sm"
                classNamePrefix="select"
              />

              <button
                onClick={handleSubmitProjectUpdate}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded text-sm"
              >
                Save Changes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardHeader;
