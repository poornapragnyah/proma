const { db } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const loginUser = async (req, res) => {
    try {
      const { username, password } = req.body;
      // Validate that both emailOrUsername and password are provided
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
      let query;
      let params;
    query = 'SELECT * FROM users WHERE username = ?';
    params = [username];

  
      // Query the database
      const [users] = await db.query(query, params);
      console.log(users);
      if (users.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }
  
      const user = users[0];
  
      // Validate the password against the hashed password in the database
      if (!user.password_hash) {
        return res.status(500).json({ message: 'Password not found in database' });
      }
  
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const role = 'project_member'
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username, role: role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Respond with the token and user data
      res.json({
        token,
        user: { id: user.id, username: user.username, email: user.email }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  }

const loginManager = async (req, res) => {
    try {
      const { username, password } = req.body;
      // Validate that both emailOrUsername and password are provided
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
      let query;
      let params;
    query = 'SELECT * FROM manager WHERE username = ?';
    params = [username];

  
      // Query the database
      const [managers] = await db.query(query, params);
      if (managers.length === 0) {
        return res.status(401).json({ message: 'Manager not found' });
      }
  
      const manager = managers[0];
  
      // Validate the password against the hashed password in the database
      if (!manager.password_hash) {
        return res.status(500).json({ message: 'Password not found in database' });
      }
  
      const validPassword = await bcrypt.compare(password, manager.password_hash);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { userId: manager.id, username: manager.username , role: 'project_manager'},
        JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Respond with the token and user data
      res.json({
        token,
        manager: { id: manager.id, username: manager.username, email: manager.email }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  }

const loginAdmin = async (req, res) => {
    try {
      const { username, password } = req.body;
      // Validate that both emailOrUsername and password are provided
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
      let query;
      let params;
    query = 'SELECT * FROM admins WHERE username = ?';
    params = [username];

  
      // Query the database
      const [admins] = await db.query(query, params);
      console.log(admins);
      if (admins.length === 0) {
        return res.status(401).json({ message: 'Admin not found' });
      }
  
      const admin = admins[0];
  
      // Validate the password against the hashed password in the database
      if (!admin.password_hash) {
        return res.status(500).json({ message: 'Password not found in database' });
      }
  
      const validPassword = await bcrypt.compare(password, admin.password_hash);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { userId: admin.id, username: admin.username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      // Respond with the token and user data
      res.json({
        token,
        admin: { id: admin.id, username: admin.username, email: admin.email }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  }

module.exports = { loginUser, loginManager, loginAdmin};