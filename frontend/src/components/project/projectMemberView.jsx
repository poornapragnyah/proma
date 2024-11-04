const ProjectMemberView = ({ project }) => {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-lg">{project.description}</p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Member Actions</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            View Tasks
          </button>
        </div>
      </div>
    );
  };

export default ProjectMemberView;