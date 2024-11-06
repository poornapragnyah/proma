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
  console.log("project id is",req.params.projectId);
  try {
    await db.query('DELETE FROM projects WHERE id = ?', [req.params.projectId]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getNumberOfProjects = async (req, res) => {
  try {
    const [rows1] = await db.query('SELECT COUNT(*) as total_count FROM projects');
    const { total_count } = rows1[0];
    const [rows2] = await db.query('SELECT count(*) as active_count FROM projects where status != "completed"'); 
    const { active_count } = rows2[0];
    res.json({ total: total_count, active: active_count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { name,user_id, description, start_date, end_date } = req.body;
    const [result] = await db.query(
      'INSERT INTO projects (name, description, start_date, end_date) VALUES (?, ?, ?, ?)',
      [name, description, start_date, end_date]
    );
    
    // Add creator as project owner
    await db.query(
      'INSERT INTO project_members (project_id, owner_id, role) VALUES (?, ?, ?)',
      [result.insertId, user_id, 'OWNER']
    );
    res.status(201).json({
      id: result.insertId,
      ...req.body,
      creator_id: req.user.userId,
      role: 'OWNER'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// const getProjectTeam = async (req, res) => {
//   const { projectId } = req.params;
//   console.log("project id",projectId);
  
//   try {
//     const [rowsOwner] = await db.query('SELECT * FROM project_members WHERE project_id = ? and role="OWNER"', [projectId]);
//     console.log("owner",rowsOwner);
//     const [rowsMembers] = await db.query('SELECT * FROM project_members WHERE project_id = ? and role="MEMBER"', [projectId]);
//     console.log("members",rowsMembers);
//     res.json({owner: rowsOwner[0], members: rowsMembers});
//   } catch (error) {
//     console.error('Error fetching project team:', error);
//     res.status(500).json({ error: 'Failed to fetch project team' });
//   }
// };

const getProjectTeam = async (req, res) => {
  const { projectId } = req.params;
  // console.log("project id", projectId);
  
  try {
    // Query to get the project owner with details from the admins table
    const [rowsOwner] = await db.query(
      `SELECT pm.*, a.username AS owner_name, a.email AS owner_email 
       FROM project_members pm
       JOIN admins a ON pm.owner_id = a.admin_id
       WHERE pm.project_id = ? AND pm.role = 'OWNER'`,
      [projectId]
    );
    // console.log("owner", rowsOwner);

    // Query to get project members with details from the users table
    const [rowsMembers] = await db.query(
      `SELECT pm.*, u.username AS member_username, u.email AS member_email 
       FROM project_members pm
       JOIN users u ON pm.member_id = u.id
       WHERE pm.project_id = ? AND pm.role = 'MEMBER'`,
      [projectId]
    );
    // console.log("members", rowsMembers);

    // Return both owner and members in the response
    res.json({
      owner: rowsOwner[0] || null,
      members: rowsMembers
    });
  } catch (error) {
    console.error('Error fetching project team:', error);
    res.status(500).json({ error: 'Failed to fetch project team' });
  }
};


const addProjectMember = async (req, res) => {
  const { projectId } = req.params
  const { email } = req.body;
  try{
    const [rows] = await db.query(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );
    const userId = rows[0].id;
    await db.query('INSERT INTO project_members (project_id, member_id, role) VALUES (?, ?, ?)', [projectId, userId,"MEMBER"]);
    res.json({ message: 'Project member added successfully' });
  }
  catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
    console.error('Error adding project member:', error);
    res.status(500).json({ error: 'Failed to add project member' });
  }
}

const deleteProjectMember = async (req, res) => {
  const { projectId, userId } = req.params;
  try {
    await db.query('DELETE FROM project_members WHERE project_id = ? AND member_id = ?', [projectId, userId]);
    res.json({ message: 'Project member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {getProjects,getProject,updateProject,deleteProject,getNumberOfProjects,createProject,getProjectTeam,addProjectMember,deleteProjectMember};