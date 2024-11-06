import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import TaskListing from '../TaskListing';


const MemberView = ({ project }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedProject, setEditedProject] = useState({
    name: project.name,
    description: project.description,
    status: project.status || 'in_progress',
    start_date: project.start_date ? new Date(project.start_date) : null,
    end_date: project.end_date ? new Date(project.end_date) : null
  });

  const statusOptions = [
    'planned',
    'completed',
    'in_progress',
  ];
// TODO: Add task listing
// TODO: Add edit task status
  const handleEdit = async (e) => {;
    setLoading(true);

    try {
      // Format dates for MySQL
      const formattedData = {
        name: editedProject.name.trim(),
        description: editedProject.description.trim(),
        status: editedProject.status,
        start_date: editedProject.start_date ? 
          editedProject.start_date.toISOString().split('T')[0] : null,
        end_date: editedProject.end_date ? 
          editedProject.end_date.toISOString().split('T')[0] : null
      };

      console.log('Sending data:', formattedData);

      const response = await fetch(`http://localhost:3001/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formattedData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update project');
      }

      toast.success('Project updated successfully!');
      setIsEditModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 text-2xl">
      {/* Main Project Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl">{project.name}</h2>
          <p className="text-lg opacity-70">{project.description}</p>
          
          {/* Project Stats */}
          <div className="stats shadow mt-4">
            <div className="stat">
              <div className="stat-title">Status</div>
              <div className="stat-value text-md">
              <span className={`badge badge-lg ${project.status === 'in_progress' ? 'bg-green-500 text-white' : 
                  project.status === 'completed' ? 'bg-blue-500 text-white' : 
                  project.status === 'planned' ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'}`}>
  {project.status}
</span>

              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Start Date</div>
              <div className="stat-value text-sm">
                {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">End Date</div>
              <div className="stat-value text-sm">
                {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}
              </div>
            </div>
          </div>
    <TaskListing projectStatus={project.status}/>
      </div>
    </div>
    </div>
  );
};

export default MemberView;