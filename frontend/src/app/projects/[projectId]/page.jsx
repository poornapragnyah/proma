"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useUserRole } from '@/contexts/userContext'
import AdminView from '@/components/project/projectAdminView'
import ProjectManagerView from '@/components/project/projectManagerView'
import ProjectMemberView from '@/components/project/projectMemberView'
import BackButton from '@/components/BackButton'

const ProjectPage = ({params}) => {
  const [project, setproject] = useState([]); // State to hold project
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null);
  const unwrappedParams = React.use(params); // Unwrap params
    const { projectId } = unwrappedParams;

    const { userRole, loading: roleLoading } = useUserRole();

  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const fetchProject = async () => {

      try{
        const response = await fetch(`http://localhost:3001/api/projects/${projectId}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          },
        credentials: "include",
    }); // Fetching data from the API
    if (!response.ok) {
      // throw new Error('Network response was not ok');
      toast.error('Network response was not ok');
    }
      const data = await response.json(); // Parsing JSON response
      setproject(data); // Setting projects state
    } catch (error) {
      console.error('Error fetching project:', error);
      setError(error.message); // Handling errors
    } finally {
      setLoading(false); // Setting loading state to false
    }
  }; 
  fetchProject(); // Call the fetch function
}, []); 
  
if (loading) return <div className="text-center">Loading...</div>;

// Error state
  if (error) {
  console.log(error);
  return <div className="text-center text-red-500 text-xl font-bold mt-5">Project not found :(</div>};

    const renderProjectView = () => {
      switch (userRole) {
        case 'project_manager':
          return <ProjectManagerView project={project} />;
        case 'project_member':
          return <ProjectMemberView project={project} />;
        case 'admin':
          return <AdminView project={project} />;
        default:
          return (
            <div className="text-center text-red-500">
              Unauthorized to view this project
            </div>
          );
      }
    };
    

    return (
      <div className="max-w-4xl mx-auto p-6">
        <BackButton link={'/projects'}/>
        {project ? renderProjectView() : <div>Project not found</div>}
      </div>
    );
  };
  
export default ProjectPage;