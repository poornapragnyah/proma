// File: routes/projects.js
const express = require('express');
const {getProjects,
    getProject,
    updateProject,
    deleteProject,
    getNumberOfProjects,
    createProject,
    getProjectTeam,
    addProjectMember,
    deleteProjectMember,
    getProjectTasks,
    createProjectTask
} = require('../controllers/projectController');

const {verifyToken}  = require('../middleware/auth');
const router = express.Router();

router.get('/', verifyToken, getProjects);
router.post('/', verifyToken, createProject);
router.get('/total', verifyToken,getNumberOfProjects);

router.get('/:projectId/team', verifyToken, getProjectTeam);
router.get('/:projectId/tasks', verifyToken, getProjectTasks);
router.post('/:projectId/tasks', verifyToken, createProjectTask);
router.post('/:projectId/team/add-member', verifyToken, addProjectMember);
router.delete('/:projectId/team/remove-member/:userId', verifyToken,deleteProjectMember);

router.get('/:projectId', verifyToken, getProject);
router.patch('/:projectId', verifyToken, updateProject)
router.delete('/:projectId', verifyToken, deleteProject)

module.exports = router;