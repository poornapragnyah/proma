// File: routes/projects.js
const express = require('express');
const {getProjects,getProject,updateProject,deleteProject} = require('../controllers/projectController');

const {verifyToken}  = require('../middleware/auth');
const router = express.Router();

router.get('/', verifyToken, getProjects);
router.get('/:projectId', verifyToken, getProject);
router.patch('/:projectId', verifyToken, updateProject)
router.delete('/:projectId', verifyToken, deleteProject)

module.exports = router;