const { db } = require('../config/database');
const bcrypt = require('bcrypt');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const registerMember = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Check if user exists
      const [existingUsers] = await db.query(
        'SELECT * FROM users WHERE email = ? OR username = ?',
        [email || '', username || '']
      );
  
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create user
      const [result] = await db.query(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
  
  
      res.status(201).json({
        message: 'User registered successfully',
        user: { username, email }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  }

const registerManager = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const [existingManagers] = await db.query(
      'SELECT * FROM managers WHERE email = ? OR username = ?',
      [email || '', username || '']
    );

    if (existingManagers.length > 0) {
      return res.status(400).json({ message: 'Manager already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await db.query(
      'INSERT INTO managers (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: 'Manager registered successfully',
      user: { username, email }
    });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
}

const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const [existingAdmins] = await db.query(
      'SELECT * FROM admins WHERE email = ? OR username = ?',
      [email || '', username || '']
    );

    if (existingAdmins.length > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await db.query(
      'INSERT INTO admins (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: 'Admin registered successfully',
      user: { username, email }
    });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
}


module.exports = {registerMember, registerManager, registerAdmin};