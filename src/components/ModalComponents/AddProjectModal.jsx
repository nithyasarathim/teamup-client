import React, { useState, useContext } from 'react';
import Select from 'react-select';
import UserContext from '../../context/UserContext.jsx';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AddProjectModal = ({ setShowAddProjectModal }) => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    projectName: '',
    teamName: '',
    roles: [],
    projectType: '',
    projectDuration: '',
    projectStatus: '',
    skills: [],
    projectLink: '',
    prototypeLink: '',
    referenceLink: '',
    teamSize: ''
  });

  // API base URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

  const roleOptions = [
    { value: 'Frontend Developer', label: 'Frontend Developer' },
    { value: 'Backend Developer', label: 'Backend Developer' },
    { value: 'Fullstack Developer', label: 'Fullstack Developer' },
    { value: 'UI/UX Designer', label: 'UI/UX Designer' },
    { value: 'Mobile App Developer', label: 'Mobile App Developer' },
    { value: 'Machine Learning Engineer', label: 'Machine Learning Engineer' },
    { value: 'Data Scientist', label: 'Data Scientist' },
    { value: 'AI Developer', label: 'AI Developer' },
    { value: 'Embedded Systems Engineer', label: 'Embedded Systems Engineer' },
    { value: 'IoT Developer', label: 'IoT Developer' },
    { value: 'Cloud Engineer', label: 'Cloud Engineer' },
    { value: 'DevOps Engineer', label: 'DevOps Engineer' },
    { value: 'Cybersecurity Analyst', label: 'Cybersecurity Analyst' },
    { value: 'QA/Testing Engineer', label: 'QA/Testing Engineer' },
    { value: 'Project Manager', label: 'Project Manager' },
    { value: 'Technical Writer', label: 'Technical Writer' },
    { value: 'AR/VR Developer', label: 'AR/VR Developer' },
    { value: 'Blockchain Developer', label: 'Blockchain Developer' },
    { value: 'Game Developer', label: 'Game Developer' },
    { value: 'System Designer', label: 'System Designer' },
  ];

  const skillOptions = [
    { value: 'HTML', label: 'HTML' },
    { value: 'CSS', label: 'CSS' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'React', label: 'React' },
    { value: 'Vue.js', label: 'Vue.js' },
    { value: 'Next.js', label: 'Next.js' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'Express.js', label: 'Express.js' },
    { value: 'Python', label: 'Python' },
    { value: 'Django', label: 'Django' },
    { value: 'Flask', label: 'Flask' },
    { value: 'Java', label: 'Java' },
    { value: 'Spring Boot', label: 'Spring Boot' },
    { value: 'C++', label: 'C++' },
    { value: 'MySQL', label: 'MySQL' },
    { value: 'MongoDB', label: 'MongoDB' },
    { value: 'Firebase', label: 'Firebase' },
    { value: 'Git', label: 'Git' },
    { value: 'GitHub', label: 'GitHub' },
    { value: 'Figma', label: 'Figma' },
    { value: 'Canva', label: 'Canva' },
    { value: 'REST API', label: 'REST API' },
    { value: 'GraphQL', label: 'GraphQL' },
    { value: 'Linux', label: 'Linux' },
    { value: 'AWS', label: 'AWS' },
    { value: 'Docker', label: 'Docker' },
    { value: 'Postman', label: 'Postman' },
    { value: 'Machine Learning', label: 'Machine Learning' },
    { value: 'Deep Learning', label: 'Deep Learning' },
    { value: 'NLP', label: 'NLP' },
    { value: 'TensorFlow', label: 'TensorFlow' },
    { value: 'OpenCV', label: 'OpenCV' },
    { value: 'Data Structures', label: 'Data Structures' },
    { value: 'Algorithms', label: 'Algorithms' },
    { value: 'Problem Solving', label: 'Problem Solving' },
  ];

  const projectTypeOptions = [
    { value: 'Hackathon', label: 'Hackathon' },
    { value: 'College Project', label: 'College Project' },
    { value: 'Open Innovation', label: 'Open Innovation' },
    { value: 'Paper Publication', label: 'Paper Publication' },
  ];

  const projectStatusOptions = [
    { value: 'On hold', label: 'On hold' },
    { value: 'On progress', label: 'On progress' },
    { value: 'Not Started', label: 'Not Started' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setShowAddProjectModal(false);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();

    if (
      !formData.projectName ||
      !formData.teamName ||
      !formData.projectType ||
      !formData.projectDuration ||
      !formData.projectStatus ||
      !formData.teamSize ||
      formData.roles.length === 0 ||
      formData.skills.length === 0
    ) {
      toast.info('Please fill in all required fields');
      return;
    }

    const preparedData = {
      ...formData,
      roles: formData.roles.map((r) => r.value),
      skills: formData.skills.map((s) => s.value),
      teamLeadName: user.username,
      teamLeadId: user.id,
      teamMembers: [
        {
          name: user.username,
          role: 'Leader',
          userid: user.id
        }
      ]
    };

    try {
      const response = await fetch(`${API_URL}/projects/project-create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preparedData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Project created successfully');
        setShowAddProjectModal(false);
      } else {
        toast.error(data.error || 'Error creating project');
      }
    } catch (error) {
      toast.error(error.message || 'Error creating project');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 w-full h-full bg-[#00000090] flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white w-[50%] min-w-[350px] max-h-[90%] h-[100%] overflow-y-auto p-6 rounded-lg shadow-lg"
          initial={{ scale: 0.8, opacity: 0, y: -40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Create New Project</h2>
          <form onSubmit={handleAddProject} className="flex flex-col gap-3">
            <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} placeholder="Project Name" className="input p-2" />
            <input type="text" name="teamName" value={formData.teamName} onChange={handleChange} placeholder="Team Name" className="input p-2" />

            <Select
              isMulti
              name="roles"
              options={roleOptions}
              value={formData.roles}
              onChange={(selected) => setFormData({ ...formData, roles: selected })}
              placeholder="Select Roles"
              classNamePrefix="select"
            />

            <div className="flex gap-4">
              <Select
                name="projectType"
                options={projectTypeOptions}
                value={projectTypeOptions.find((option) => option.value === formData.projectType)}
                onChange={(selected) => setFormData({ ...formData, projectType: selected.value })}
                placeholder="Select Project Type"
                classNamePrefix="select"
              />
              <Select
                name="projectStatus"
                options={projectStatusOptions}
                value={projectStatusOptions.find((option) => option.value === formData.projectStatus)}
                onChange={(selected) => setFormData({ ...formData, projectStatus: selected.value })}
                placeholder="Select Project Status"
                classNamePrefix="select"
              />
            </div>

            <div className="flex gap-4">
              <input type="number" name="projectDuration" value={formData.projectDuration} onChange={handleChange} placeholder="Project Duration (months)" className="input p-2 flex-1 border border-gray-300 rounded-md" />
              <input type="number" name="teamSize" value={formData.teamSize} onChange={handleChange} max={8} placeholder="Team Size" className="input p-2 flex-1 border border-gray-300 rounded-md" />
            </div>

            <Select
              isMulti
              name="skills"
              options={skillOptions}
              value={formData.skills}
              onChange={(selected) => setFormData({ ...formData, skills: selected })}
              placeholder="Select Skills"
              classNamePrefix="select"
            />

            <input type="text" name="projectLink" value={formData.projectLink} onChange={handleChange} placeholder="Project Link (optional)" className="input p-2" />
            <input type="text" name="prototypeLink" value={formData.prototypeLink} onChange={handleChange} placeholder="Prototype Link (optional)" className="input p-2" />
            <input type="text" name="referenceLink" value={formData.referenceLink} onChange={handleChange} placeholder="Reference Link (optional)" className="input p-2" />

            <div className="flex justify-between mt-4">
              <button type="button" onClick={handleClose} className="text-gray-600 border border-gray-300 px-4 py-1 rounded-lg hover:bg-gray-100">Cancel</button>
              <button type="submit" className="bg-sky-500 text-white px-4 py-1 rounded-lg shadow-md hover:bg-sky-600 duration-300">Create Project</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddProjectModal;
