// File: middleware/permissions.js
const { db } = require('../config/database');

// Define permission levels for different roles
const ROLE_PERMISSIONS = {
  OWNER: ['create', 'read', 'update', 'delete', 'manage_members', 'manage_roles'],
  ADMIN: ['create', 'read', 'update', 'delete', 'manage_members'],
  MEMBER: ['create', 'read', 'update']
};

// Check if user has required permission for the project
const checkProjectPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const projectId = req.params.projectId || req.body.project_id;
      if (!projectId) {
        return res.status(400).json({ message: 'Project ID required' });
      }

      const [members] = await db.query(
        'SELECT role FROM project_members WHERE project_id = ? AND user_id = ?',
        [projectId, req.user.userId]
      );

      if (members.length === 0) {
        return res.status(403).json({ message: 'No access to this project' });
      }

      const userRole = members[0].role;
      const allowedPermissions = ROLE_PERMISSIONS[userRole];

      if (!allowedPermissions.includes(requiredPermission)) {
        return res.status(403).json({ 
          message: `Insufficient permissions. Required: ${requiredPermission}` 
        });
      }

      req.userProjectRole = userRole;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

module.exports = { checkProjectPermission, ROLE_PERMISSIONS };

// File: middleware/projectAccess.js
const validateProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.body.project_id;
    
    const [project] = await db.query(
      'SELECT p.*, pm.role FROM projects p ' +
      'INNER JOIN project_members pm ON p.id = pm.project_id ' +
      'WHERE p.id = ? AND pm.user_id = ?',
      [projectId, req.user.userId]
    );

    if (project.length === 0) {
      return res.status(404).json({ message: 'Project not found or no access' });
    }

    req.project = project[0];
    req.userProjectRole = project[0].role;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { validateProjectAccess };