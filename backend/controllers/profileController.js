const { db } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const multer = require('multer');
const storage = multer.memoryStorage(); // Store image in memory as a buffer
const upload = multer({ storage });

const getProfileDetails = async (req, res) => {
    try{
        let query;
        if (req.user.role === 'admin') {
            query = `SELECT * FROM admins WHERE admin_id = ?`;
        } else if (req.user.role === 'project_member') {
            query = `SELECT * FROM users WHERE id = ?`;
        }
        else if (req.user.role === 'project_manager') {
            query = `SELECT * FROM manager WHERE manager_id = ?`;
        }
        console.log("user id",req.user.userId)
        const [rows] = await db.query(
            query, 
            [req.user.userId]
        );
        res.json(rows[0]);
        console.log(rows[0])
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getProfileDetailsTeam = async (req, res) => {
    console.log("user id",req.params.userId)
    try{
        const [rows] = await db.query(
            `SELECT * FROM admins WHERE admin_id = ?`,
            [req.params.userId]
        );
        res.json(rows[0]);
        console.log("from controller 1",rows[0])
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getProfileDetailsOwner = async (req, res) => { 
    try{
        const [rows] = await db.query(
            `SELECT * FROM admins WHERE admin_id = ?`,
            [req.user.userId]
        );
        res.json(rows[0]);
        console.log(rows[0])
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateProfileDetails = async (req, res) => {
    // console.log("project controller", req.body)
    try {
        let query;
        if (req.user.role === 'admin') {
            query = `UPDATE admins SET username = ?, email = ? WHERE admin_id = ?`;
        } else if (req.user.role === 'project_member') {
            query = `UPDATE users SET username = ?, email = ? WHERE id = ?`;
        }
        else if (req.user.role === 'project_manager') {
            query = `UPDATE manager SET username = ?, email = ? WHERE manager_id = ?`;
        }

        const { username, email } = req.body;
        // const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
           query,
            [username, email, req.user.userId]
        );
        res.status(200).json({
            id: req.user.userId,
            username,
            email
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

const uploadImage = async (req, res) => {
    try {
        // Access the image buffer from multer's req.file
        const imageBuffer = req.file.buffer;

        if (!imageBuffer) {
            return res.status(400).json({ error: 'No image uploaded' });
        }
        let query;
        if(req.user.role === 'admin'){
            query = `UPDATE admins SET profile_image = ? WHERE admin_id = ?`;
        } else if(req.user.role === 'project_member'){
            query = `UPDATE users SET profile_image = ? WHERE id = ?`;
        }
        else if(req.user.role === 'project_manager'){
            query = `UPDATE manager SET profile_image = ? WHERE manager_id = ?`;
        }
        // SQL query to update the image as a blob in the MySQL database
        const [result] = await db.query(
            query,
            [imageBuffer, req.user.userId] // Assuming req.user.userId is set after authentication
        );

        res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
}
const getImage = async (req, res) => {
    console.log("user role",req.user.role)
    try {
        let query;
        if (req.user.role === 'admin') {
            query = `SELECT profile_image FROM admins WHERE admin_id = ?`;
        } else if (req.user.role === 'project_member') {
            query = `SELECT profile_image FROM users WHERE id = ?`;
        }
        else if (req.user.role === 'project_manager') {
            query = `SELECT profile_image FROM manager WHERE manager_id = ?`;
        }
        const result = await db.query(
            query, 
            [req.user.userId]
        );

        // Check if user is found
        if (result.length > 0) {
            console.log("result",result)
            const profileImage = result[0][0].profile_image

            if (!profileImage) {
                return res.status(404).json({ message: 'No profile image found' });
            }

            console.log("profile image",profileImage)

            // Convert to base64 string
            const base64Image = Buffer.from(profileImage).toString('base64');

            // Send the image back as a JSON response
            res.status(200).json({ profileImage: `data:image/png;base64,${base64Image}` });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error retrieving image:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    getProfileDetails,
    updateProfileDetails,
    uploadImage,
    getImage,
    getProfileDetailsTeam,
    getProfileDetailsOwner
}