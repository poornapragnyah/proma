const express = require('express');
const registerController = require('../controllers/registerController');

const router = express.Router();

router.post('/team-member', registerController.registerMember);
router.post('/team-manager', registerController.registerManager);
router.post('/admin', registerController.registerAdmin);

module.exports =  router;