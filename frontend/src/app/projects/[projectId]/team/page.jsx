"use client";
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { UserPlus, UserMinus, Crown } from 'lucide-react';
import { set } from 'react-hook-form';

const TeamPage = ({ params }) => {
  const [team, setTeam] = useState({ owner: null, members: [] });
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const unwrappedParams = React.use(params);
  const { projectId } = unwrappedParams;

  useEffect(() => {
    fetchTeam();
  }, []);

  // Fetch team data
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
      
      if (!response.ok) {
        throw new Error('Failed to fetch team');
      }
      
      const result = await response.json();
      setTeam(result);

      setOwnerDetails(result.owner);

    //   // Fetch owner details if we have an owner
    //   if (result.owner?.owner_id) {
    //     await fetchOwnerDetails(result.owner.owner_id);
    //   }
    } catch (error) {
      toast.error(error.message);
      setTeam({ owner: null, members: [] });
    }
  };

  // Fetch user details (for owner)
  const fetchOwnerDetails = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/profile/owner/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await response.json();
      console.log("Owner data",userData)
      setOwnerDetails(userData);
      console.log("owner detail",ownerDetails)
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };


  const handleAddMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/projects/${projectId}/team/add-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ email: newMemberEmail }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to add team member');
      }

      toast.success('Team member added successfully!');
      setIsAddModalOpen(false);
      setNewMemberEmail('');
      fetchTeam();
    } catch (error) {
      toast.error(error.message);
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

      if (!response.ok) {
        throw new Error('Failed to remove team member');
      }

      toast.success('Team member removed successfully!');
      fetchTeam();
    } catch (error) {
      toast.error(error.message);
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
          Add Member
        </button>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" >
        {/* Owner Card */}
        {team.owner && (
          <div className="card bg-base-100 shadow-xl border-2 border-primary"  key={team.owner.owner_id}>
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
          <h3 className="font-bold text-lg">Add Team Member</h3>
          <form onSubmit={handleAddMember}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Member Email</span>
              </label>
              <input 
                type="email" 
                className="input input-bordered w-full" 
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="modal-action">
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Member'}
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

      {/* Empty State */}
      {!team.owner &&team.members&& team.members.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No team members yet</h3>
          <p className="text-gray-500">Start building your team by adding members</p>
        </div>
      )}
    </div>
  );
};

export default TeamPage;