"use client";
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserPlus, UserMinus, Crown } from 'lucide-react';

const TeamPage = ({ params }) => {
  const [team, setTeam] = useState({ owner: null, managers:[],members: [] });
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [newMemberRole, setNewMemberRole] = useState('Member');
  const [userDetails, setUserDetails] = useState(null);
  const { projectId } = React.use(params);
  console.log("project id",projectId);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/projects/${projectId}/team`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to fetch team');
      
      const result = await response.json();
      setTeam(result);
      setOwnerDetails(result.owner);
    } catch (error) {
      toast.error(error.message);
      setTeam({ owner: null,managers:[], members: [] });
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    console.log("new member email",newMemberEmail);
    console.log("new member role",newMemberRole);
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/projects/${projectId}/team/add-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ projectId: projectId,email: newMemberEmail, role: newMemberRole }),
        credentials: 'include',
      });
      const data = await response.json();
      console.log("response",data);
      if (response.status !== 200) {
        toast.error(data.message || 'Failed to add team member');
        throw new Error('Failed to add team member');
      }

      toast.success('Team member added successfully!');
      setIsAddModalOpen(false);
      setNewMemberEmail('');
      fetchTeam();
    } catch (error) {
      console.error('Add member error:', error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/projects/${projectId}/team/remove-member/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to remove team member');

      toast.success('Team member removed successfully!');
      fetchTeam();
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Project Team</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add
        </button>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Owner Card */}
        {team.owner && (
          <div className="card bg-base-100 shadow-xl border-2 border-primary" key={team.owner.owner_id}>
            <div className="card-body">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="avatar placeholder mr-4">
                    <div className="bg-neutral text-neutral-content rounded-full w-12">
                      <span className="text-xl">
                        {ownerDetails?.owner_name?.charAt(0) || 'O'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h2 className="card-title flex items-center">
                      {ownerDetails?.owner_name || 'Project Owner'}
                      <Crown className="w-5 h-5 ml-2 text-yellow-500" />
                    </h2>
                    <p className="text-sm opacity-70">{ownerDetails?.owner_email || 'Loading...'}</p>
                    <span className="badge badge-primary mt-2">Owner</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Manager Cards */}
        {team.managers && team.managers.map((manager) => (
          console.log("manager",manager),
          <div className="card bg-base-100 shadow-xl border-2 border-secondary" key={manager.manager_id}>
            <div className="card-body">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="avatar placeholder mr-4">
                    <div className="bg-neutral text-neutral-content rounded-full w-12">
                      <span className="text-xl">
                        {manager.manager_username?.charAt(0) || 'M'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h2 className="card-title flex items-center">
                      {manager.manager_username || 'Project Manager'}
                    </h2>
                    <p className="text-sm opacity-70">{manager.manager_email || 'Loading...'}</p>
                    <span className="badge badge-secondary mt-2">Manager</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}


        {/* Member Cards */}
        {team.members && team.members.map((member) => (
          <div key={member.member_id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="avatar placeholder mr-4">
                    <div className="bg-neutral text-neutral-content rounded-full w-12">
                      <span className="text-xl">{member.member_username?.charAt(0) || 'M'}</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="card-title">{member.member_username || 'Team Member'}</h2>
                    <p className="text-sm opacity-70">{member.member_email}</p>
                    <span className="badge mt-2">Member</span>
                  </div>
                </div>
                <button 
                  className="btn btn-ghost btn-circle text-error"
                  onClick={() => handleRemoveMember(member.member_id)}
                >
                  <UserMinus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      <dialog id="add_member_modal" className={`modal ${isAddModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">{`Add Team ${newMemberRole}`}</h3>
          <form onSubmit={handleAddMember}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">{`${newMemberRole} Email`}</span>
              </label>
              <input 
                type="email" 
                className="input input-bordered w-full" 
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />
              
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={newMemberRole}
                onChange={(e) => {setNewMemberRole(e.target.value);
                  console.log("new member role set as",newMemberRole)
                }}
                required
              >
                <option value="Member">Member</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

            <div className="modal-action">
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Adding...' : `Add ${newMemberRole}`}
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
      </dialog>

      {/* Empty State */}
      {!team.owner && (!team.members || team.members.length === 0) && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No team members yet</h3>
          <p className="text-gray-500">Start building your team by adding members</p>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default TeamPage;
