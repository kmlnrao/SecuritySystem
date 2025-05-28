const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { storage } = require('../server/storage');

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 3001;

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
}));
app.use(express.json());

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // Find user
    const user = await storage.getUserByUsername(username);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // For demo purposes, comparing plain text passwords
    // In production, use bcrypt.compare(password, user.password)
    if (password !== 'password123') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Get user roles
    const roles = await storage.getUserRoles(user.id);

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        email: user.email,
        roles: roles.map(role => role.name)
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isActive: user.isActive,
        roles: roles.map(role => role.name)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify token endpoint
app.get('/verify-token', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    // Get fresh user data
    const user = await storage.getUser(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    const roles = await storage.getUserRoles(user.id);

    res.json({
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isActive: user.isActive,
        roles: roles.map(role => role.name)
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'auth-service', status: 'healthy', port: PORT });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🔐 Auth Service running on port ${PORT}`);
  });
}

module.exports = app;