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

    const [rowsManager] = await db.query(
      `SELECT pm.*, m.username AS manager_username, m.email AS manager_email
        FROM project_members pm
        JOIN manager m ON pm.manager_id = m.manager_id
        WHERE pm.project_id = ? AND pm.role = 'MANAGER'`,
      [projectId]
    );
    // console.log("members", rowsMembers);

    // Return both owner and members in the response
    res.json({
      owner: rowsOwner[0] || null,
      managers: rowsManager,      
      members: rowsMembers
    });
  } catch (error) {
    console.error('Error fetching project team:', error);
    res.status(500).json({ error: 'Failed to fetch project team' });
  }
};


const addProjectMember = async (req, res) => {
  console.log("req.body",req.body);
  const role = req.body.role;
  let {projectId}  = req.params
  projectId = parseInt(projectId, 10);
  console.log("project id",projectId);  
  const { email } = req.body;
  try{
    if(role === "Member"){
    const [rows] = await db.query(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userId = rows[0].id;
    await db.query('INSERT INTO project_members (project_id, member_id, role) VALUES (?, ?, ?)', [projectId, userId,"MEMBER"]);
    res.json({ message: 'Project member added successfully' });
  }
  else if (role === "Manager"){
    const [rows] = await db.query('SELECT manager_id FROM manager WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Manager not found' });
    }
    const managerId = rows[0].manager_id;
    await db.query('INSERT INTO project_members (project_id, manager_id, role) VALUES (?, ?, ?)', [projectId, managerId,"MANAGER"]);
    res.json({ message: 'Project member added successfully' });
  }}
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

const getProjectTasks = async (req, res) => {
  const { projectId } = req.params;
  console.log("project id",projectId);
  try {
    const [rows] = await db.query('SELECT * FROM tasks WHERE project_id = ?', [projectId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProjectTask = async (req, res) => {
  const { projectId } = req.params;
  const { name, description, status } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO tasks (title, description, status, project_id) VALUES (?, ?, ?, ?)',
      [name, description, status, projectId]
    );
    console.log("result",result);
    res.status(201).json({
      id: result.insertId,
      name,
      description,
      status,
      project_id: projectId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const updateProjectTask = async (req, res) => {
  const { projectId, taskId } = req.params;
  console.log("project id",projectId);
  console.log("task id",taskId);
  const { name, description, status } = req.body;
  console.log("req body is",req.body);
  try {
    const [result] = await db.query(
      'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND project_id = ?',
      [name, description, status, taskId, projectId]
    );
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteProjectTask = async (req, res) => {
  const { projectId, taskId } = req.params;
  try {
    await db.query('DELETE FROM tasks WHERE project_id = ? AND id = ?', [projectId, taskId]);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const getMyProjects = async (req, res) => {
  console.log("role", req.user.role);
  try {
    let query;
    if (req.user.role === 'admin') {  
      query = 'SELECT * FROM project_members WHERE owner_id = ?';
    } else if (req.user.role === 'project_member') {
      query = 'SELECT * FROM project_members WHERE member_id = ?';
    } else if (req.user.role === 'project_manager') {
      query = 'SELECT * FROM project_members WHERE manager_id = ?';
    }

    const [tasks] = await db.query(query, [req.user.userId]);

    // If no tasks are found, return an empty array
    if (tasks.length === 0) {
      return res.json([]);
    }

    // Extract project IDs from tasks and prepare them for an IN query
    const projectIds = tasks.map(task => task.project_id);

    // Use a single query to get all projects matching the IDs
    const [projects] = await db.query('SELECT * FROM projects WHERE id IN (?)', [projectIds]);

    // Create a mapping of project_id to tasks to include additional info if needed
    const result = projects.map(project => {
      const taskInfo = tasks.find(task => task.project_id === project.id);
      return { ...project, role: taskInfo.role };
    });

    res.json(result);

  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: error.message });
  }
};

const getMyNumberOfProjects = async (req, res) => {
  try {
    let query
    if (req.user.role === 'admin') {
      query = 'SELECT COUNT(*) as total_count FROM project_members WHERE owner_id = ?';
    } else if (req.user.role === 'project_member') {
      query = 'SELECT COUNT(*) as total_count FROM project_members WHERE member_id = ?';
    } else if (req.user.role === 'project_manager') {
      query = 'SELECT COUNT(*) as total_count FROM project_members WHERE manager_id = ?';
    }

    const [total] = await db.query(query, [req.user.userId]);
    res.json({ total: total[0].total_count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {getProjects,getProject,updateProject,deleteProject,getNumberOfProjects,createProject,getProjectTeam,addProjectMember,deleteProjectMember,getProjectTasks,createProjectTask,updateProjectTask,deleteProjectTask,getMyProjects,getMyNumberOfProjects};