// src/pages/ProjectDashboard/ProjectDashboard.jsx
import React, { useEffect, useState, useContext } from 'react';
import KanbanBoard from '../../components/ProjectDashboardComponents/KanbanBoard';
import Header from '../../components/Header';
import DashboardHeader from '../../components/ProjectDashboardComponents/DashboardHeader';
import Error403 from '../../pages/AuthPages/Error403Page';
import { useParams } from 'react-router-dom';
import UserContext from '../../context/UserContext.jsx';

const ProjectDashboard = () => {
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;

  const [refresh,setRefresh] = useState(false);
  const [projectData,setProjectData] = useState(null);
  const [hasAccess,setHasAccess] = useState(false);
  const [loading,setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const userId = user?.id || '';

  useEffect(()=>{
    const fetchProject = async ()=>{
      try{
        setLoading(true);
        const res = await fetch(`${API_URL}/projects/${id}`);
        if(!res.ok){setHasAccess(false);setLoading(false);return;}
        const data = await res.json();
        setProjectData(data);

        const isTeamMember = data.teamMembers?.some(m=>m.userid===userId)||userId===data.teamLeadId;
        setHasAccess(isTeamMember);
      }catch(err){
        console.error('Error fetching project:',err.message);
        setHasAccess(false);
      }finally{setLoading(false);}
    };
    fetchProject();
  },[id,userId,refresh]);

  const updateTaskColumns = async(updatedColumns)=>{
    try{
      const res = await fetch(`${API_URL}/projects/${id}`,{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({todo:updatedColumns['To Do'],onprogress:updatedColumns['Under Progress'],review:updatedColumns['Review'],done:updatedColumns['Done']})
      });
      if(!res.ok) throw new Error('Failed to update tasks');
      setRefresh(!refresh);
    }catch(err){console.error('Error updating tasks:',err.message);}
  };

  if(loading) return <div>Loading...</div>;
  if(!hasAccess) return <Error403 />;

  return (
    <div>
      <Header/>
      <DashboardHeader data={projectData} setRefresh={setRefresh} refresh={refresh}/>
      {projectData&&<KanbanBoard data={projectData} onUpdateColumns={updateTaskColumns}/>}
    </div>
  );
};

export default ProjectDashboard;
