import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useUserRole } from '@/contexts/userContext';

const TaskListing = () => {
  const [tasks, setTasks] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const {userRole} = useUserRole();
  console.log("userRole",userRole)
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    status: 'planned',
  });
  const { projectId, projectStatus } = useParams()
  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/projects/${projectId}/tasks`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      console.log("from task listing",data)
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    }
  };
  // Fetch tasks for the project
    useEffect(() => {
  fetchTasks();
}, []);

  // Open the edit modal
  const openEditModal = (task) => {
    setSelectedTask(task);
    setNewTask({
      name: task.name,
      description: task.description,
      status: task.status,
    });
    setIsModalOpen(true);
  };

  // Close the edit modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setNewTask({
      name: '',
      description: '',
      status: 'planned',
    });
  };

  // Update a task
  const updateTask = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/projects/${projectId}/tasks/${selectedTask.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update task');
      }

      toast.success('Task updated successfully');
      closeModal();
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(error.message || 'Failed to update task');
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete task');
      }

      toast.success('Task deleted successfully');
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(error.message || 'Failed to delete task');
    }
  };

  // Create a new task
  const createTask = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create task');
      }

      toast.success('Task created successfully');
      setNewTask({
        name: '',
        description: '',
        status: 'planned',
      });
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(error.message || 'Failed to create task');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tasks</h2>
        {isAuth?<button className="btn btn-primary" onClick={() => {
  setIsModalOpen(true);
  setSelectedTask(null); // Reset selectedTask to null to indicate adding a new task
  setNewTask({
    name: '',
    description: '',
    status: 'planned',
  });
}}>
  Add New Task
</button>:null}

      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="p-5 bg-base-200 white shadow rounded-lg flex flex-col md:flex-row items-center justify-between">
            <div className="flex-1 mb-2 md:mb-0">
              <p className="text-gray-600">{task.title}</p>
              <h3 className="text-lg font-semibold">{task.description}</h3>
              <span
                className={`inline-block px-2 py-1 mt-2 text-sm rounded-full ${
                  task.status === 'to_do'
                    ? 'bg-yellow-500 text-black'
                    : task.status === 'in_progress'
                    ? 'bg-blue-500 text-white'
                    : 'bg-green-500 text-white'
                }`}
              >
                {task.status}
              </span>
            </div>
            <div className="flex space-x-2">
                  {(userRole === 'admin' || userRole === 'project_manager') && (
                    <button
                      className={`btn btn-sm ${
                        projectStatus === 'planned'
                          ? 'btn-primary'
                          : projectStatus === 'in_progress'
                          ? 'btn-info'
                          : 'btn-success'
                      }`}
                      onClick={() => openEditModal(task)}
                    >
                      Edit
                    </button>
                  )}

                  {/* Show Delete button only for project_manager */}
                  {userRole === 'admin' && (
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>)}
                </div>
            </div>
        ))}
      </div>

      {/* Edit Task Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
          <h3 className="font-bold text-lg">
  {selectedTask ? 'Edit Task' : 'Add New Task'}
</h3>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Task name"
                className="input input-bordered"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              ></textarea>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                className="select select-bordered"
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              >
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="modal-action">
            <button
                className={`btn ${
                    projectStatus === 'planned'
                    ? 'btn-primary'
                    : projectStatus === 'in_progress'
                    ? 'btn-info'
                    : 'btn-success'
                }`}
                onClick={selectedTask ? updateTask : createTask} // Conditionally call createTask or updateTask
                >
                {selectedTask ? 'Save' : 'Add Task'}
                </button>
              <button className="btn btn-error" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskListing;
