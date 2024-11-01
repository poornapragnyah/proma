const express = require('express');
const loginController = require('../controllers/loginController');

const router = express.Router();

router.post('/team-member', loginController.loginUser);
router.post('/team-manager', loginController.loginManager);
router.post('/admin', loginController.loginAdmin);

module.exports =  router;