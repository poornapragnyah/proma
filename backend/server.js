// File: server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const loginRoutes = require('./routes/login');
const { db } = require('./config/database');
const  verifyToken  = require('./middleware/auth');
const registerRoutes = require('./routes/register');
const projectRoutes = require('./routes/project');

const app = express();
// Middleware
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000', // replace with your frontend URL in production
    credentials: true,
};
app.use(cors(corsOptions));
// // Use login routes
// app.use('/api/login', login);
// Auth Routes

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/auth/register', registerRoutes);
app.use('/api/auth/login', loginRoutes)
app.use('/api/projects',projectRoutes);

  
// Health check route (unprotected)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Projects Routes (protected)
// app.get('/api/projects', verifyToken, async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       `SELECT p.*, pm.role as user_role 
//        FROM projects p 
//        INNER JOIN project_members pm ON p.id = pm.project_id 
//        WHERE pm.user_id = ?`,
//       [req.user.userId]
//     );
//     res.json(rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.post('/api/projects', verifyToken, async (req, res) => {
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

// // Tasks Routes (protected)
// app.get('/api/tasks', verifyToken, async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       `SELECT t.*, p.name as project_name 
//        FROM tasks t 
//        INNER JOIN projects p ON t.project_id = p.id
//        INNER JOIN project_members pm ON p.id = pm.project_id 
//        WHERE pm.user_id = ?`,
//       [req.user.userId]
//     );
//     res.json(rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.post('/api/tasks', verifyToken, async (req, res) => {
//   try {
//     const { project_id, title, description, status, due_date } = req.body;

//     // Verify project access
//     const [access] = await db.query(
//       'SELECT role FROM project_members WHERE project_id = ? AND user_id = ?',
//       [project_id, req.user.userId]
//     );

//     if (access.length === 0) {
//       return res.status(403).json({ message: 'No access to this project' });
//     }

//     const [result] = await db.query(
//       'INSERT INTO tasks (project_id, title, description, status, due_date, creator_id) VALUES (?, ?, ?, ?, ?, ?)',
//       [project_id, title, description, status, due_date, req.user.userId]
//     );

//     res.status(201).json({
//       id: result.insertId,
//       ...req.body,
//       creator_id: req.user.userId
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Project Members Routes
// app.post('/api/projects/:projectId/members', verifyToken, validateProjectAccess, 
//   checkProjectPermission('manage_members'), async (req, res) => {
//   try {
//     const { userId, role } = req.body;
    
//     // Check if user exists
//     const [users] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
//     if (users.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Add or update member
//     await db.query(
//       `INSERT INTO project_members (project_id, user_id, role) 
//        VALUES (?, ?, ?) 
//        ON DUPLICATE KEY UPDATE role = ?`,
//       [req.params.projectId, userId, role, role]
//     );

//     res.json({ message: 'Project member updated successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});