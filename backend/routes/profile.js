const express = require('express');
const {getProfileDetails, updateProfileDetails, uploadImage,getImage} = require('../controllers/profileController');
const multer = require("multer")
// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });
const {verifyToken}  = require('../middleware/auth');
const router = express.Router();

router.get('/', verifyToken, getProfileDetails);
router.patch('/',verifyToken,updateProfileDetails)
router.post('/image',verifyToken,upload.single('image'),uploadImage)
router.get('/image',verifyToken,getImage)


module.exports = router;