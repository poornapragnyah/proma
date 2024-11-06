import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProjectButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'planned',
    start_date: null,
    end_date: null
  });

  const statusOptions = [
    'planned',
    'completed',
    'in_progress',
  ];

  const handleAdd = async (e) => {
    setLoading(true);

    try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        console.log("decoded",decodedToken);
        console.log("decoded id",decodedToken.userId);
      const formattedData = {
        name: newProject.name.trim(),
        user_id: decodedToken.userId,
        description: newProject.description.trim(),
        status: newProject.status,
        start_date: newProject.start_date ? 
          newProject.start_date.toISOString().split('T')[0] : null,
        end_date: newProject.end_date ? 
          newProject.end_date.toISOString().split('T')[0] : null
      };

      const response = await fetch('http://localhost:3001/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formattedData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
          toast.error(data.message || 'Failed to create project');
        throw new Error(data.message || 'Failed to create project');
      }

      toast.success('Project created successfully!');
      setIsAddModalOpen(false);
      setNewProject({
        name: '',
        description: '',
        status: 'planned',
        start_date: null,
        end_date: null
      });
      router.refresh();
    } catch (error) {
      console.error('Create error:', error);
      toast.error(error.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        className="btn btn-primary"
        onClick={() => setIsAddModalOpen(true)}
      >
        Add New Project
      </button>

      {/* Add Project Modal */}
      <dialog id="add_modal" className={`modal ${isAddModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create New Project</h3>
          <form onSubmit={handleAdd}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Project Name</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered w-full" 
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                required
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea 
                className="textarea textarea-bordered h-24" 
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                required
              ></textarea>
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={newProject.status}
                onChange={(e) => setNewProject({...newProject, status: e.target.value})}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Start Date</span>
              </label>
              <input 
                type="date" 
                className="input input-bordered" 
                onChange={(e) => setNewProject({
                  ...newProject, 
                  start_date: e.target.value ? new Date(e.target.value) : null
                })}
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">End Date</span>
              </label>
              <input 
                type="date" 
                className="input input-bordered" 
                onChange={(e) => setNewProject({
                  ...newProject, 
                  end_date: e.target.value ? new Date(e.target.value) : null
                })}
              />
            </div>

            <div className="modal-action">
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
              <button 
                type="button"
                className="btn" 
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsAddModalOpen(false)}>close</button>
        </form>
      </dialog>
      <ToastContainer/>
    </>
  );
};

export default AddProjectButton;