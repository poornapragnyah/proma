// File: routes/projects.js
const { verifyToken } = require('../middleware/auth');
const { db } = require('../config/database');

// Get all projects user has access to

const getProjects = async (req, res) => {
  try {
    const [rows] = await db.query(
    //   `SELECT p.*, pm.role as user_role 
    //    FROM projects p 
    //    INNER JOIN project_members pm ON p.id = pm.project_id 
    //    WHERE pm.id = ?`,
    //   [req.user.userId]  
    `SELECT * FROM projects`
    );
    res.json(rows);
  } catch (error) {
    console.log("from controller",error);
    res.status(500).json({ error: error.message });
  }
};

const getProject = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM projects WHERE id = ?`,
            [req.params.projectId]
        );
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// // Create new project
// router.post('/', verifyToken, async (req, res) => {
//   try {
//     const { name, description, start_date, end_date } = req.body;
    
//     const [result] = await db.query(
//       'INSERT INTO projects (name, description, start_date, end_date) VALUES (?, ?, ?, ?)',
//       [name, description, start_date, end_date]
//     );
    
//     // Add creator as project owner
//     await db.query(
//       'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
//       [result.insertId, req.user.userId, 'OWNER']
//     );

//     res.status(201).json({
//       id: result.insertId,
//       ...req.body,
//       creator_id: req.user.userId,
//       role: 'OWNER'
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Update project
const updateProject = async (req, res) => {
    try {
      const { name, description, start_date, end_date, status } = req.body;
  
      // Create an array to hold the fields to update
      const updateFields = [];
      const values = [];
  
      // Check for each field and add to the query if it exists
      if (name !== undefined) {
        updateFields.push("name = ?");
        values.push(name);
      }
      if (description !== undefined) {
        updateFields.push("description = ?");
        values.push(description);
      }
      if (start_date !== undefined) {
        updateFields.push("start_date = ?");
        values.push(start_date);
      }
      if (end_date !== undefined) {
        updateFields.push("end_date = ?");
        values.push(end_date);
      }
      if (status !== undefined) {
        updateFields.push("status = ?");
        values.push(status);
      }
  
      // If no fields were provided for update
      if (updateFields.length === 0) {
        return res.status(400).json({ message: "No fields to update" });
      }
  
      // Add the project ID to the end of the values array
      values.push(req.params.projectId);
  
      // Create the SQL query dynamically
      const sqlQuery = `UPDATE projects SET ${updateFields.join(", ")} WHERE id = ?`;
  
      // Execute the query
      await db.query(sqlQuery, values);
  
      res.json({ message: 'Project updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
// Delete project
const deleteProject = async (req, res) => {
  try {
    await db.query('DELETE FROM projects WHERE id = ?', [req.params.projectId]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// // Manage project members
// router.post('/:projectId/members', verifyToken, validateProjectAccess, 
//   checkProjectPermission('manage_members'), async (req, res) => {
//   try {
//     const { userId, role } = req.body;
    
//     // Check if user exists
//     const [users] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
//     if (users.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check if user is already a member
//     const [existingMember] = await db.query(
//       'SELECT * FROM project_members WHERE project_id = ? AND user_id = ?',
//       [req.params.projectId, userId]
//     );

//     if (existingMember.length > 0) {
//       // Update existing member's role
//       await db.query(
//         'UPDATE project_members SET role = ? WHERE project_id = ? AND user_id = ?',
//         [role, req.params.projectId, userId]
//       );
//     } else {
//       // Add new member
//       await db.query(
//         'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
//         [req.params.projectId, userId, role]
//       );
//     }

//     res.json({ message: 'Project member updated successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Remove project member
// router.delete('/:projectId/members/:userId', verifyToken, validateProjectAccess, 
//   checkProjectPermission('manage_members'), async (req, res) => {
//   try {
//     const [member] = await db.query(
//       'SELECT role FROM project_members WHERE project_id = ? AND user_id = ?',
//       [req.params.projectId, req.params.userId]
//     );

//     // Prevent removing the last owner
//     if (member[0]?.role === 'OWNER') {
//       const [ownerCount] = await db.query(
//         'SELECT COUNT(*) as count FROM project_members WHERE project_id = ? AND role = ?',
//         [req.params.projectId, 'OWNER']
//       );
      
//       if (ownerCount[0].count <= 1) {
//         return res.status(400).json({ 
//           message: 'Cannot remove the last project owner' 
//         });
//       }
//     }

//     await db.query(
//       'DELETE FROM project_members WHERE project_id = ? AND user_id = ?',
//       [req.params.projectId, req.params.userId]
//     );

//     res.json({ message: 'Member removed successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get project members
// router.get('/:projectId/members', verifyToken, validateProjectAccess, 
//   checkProjectPermission('read'), async (req, res) => {
//   try {
//     const [members] = await db.query(
//       `SELECT u.id, u.username, u.email, pm.role, pm.created_at 
//        FROM project_members pm
//        INNER JOIN users u ON pm.user_id = u.id
//        WHERE pm.project_id = ?`,
//       [req.params.projectId]
//     );
    
//     res.json(members);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;


module.exports = {getProjects,getProject,updateProject,deleteProject};