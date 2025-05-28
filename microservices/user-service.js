const express = require('express');
const cors = require('cors');
const { storage } = require('../server/storage');

const app = express();
const PORT = process.env.USER_SERVICE_PORT || 3002;

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
}));
app.use(express.json());

// User CRUD endpoints
app.get('/users', async (req, res) => {
  try {
    const users = await storage.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

app.post('/users', async (req, res) => {
  try {
    const user = await storage.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await storage.updateUser(id, req.body);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteUser(id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Role CRUD endpoints
app.get('/roles', async (req, res) => {
  try {
    const roles = await storage.getAllRoles();
    res.json(roles);
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ message: 'Failed to fetch roles' });
  }
});

app.post('/roles', async (req, res) => {
  try {
    const role = await storage.createRole(req.body);
    res.status(201).json(role);
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({ message: 'Failed to create role' });
  }
});

app.put('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const role = await storage.updateRole(id, req.body);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Failed to update role' });
  }
});

app.delete('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteRole(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({ message: 'Failed to delete role' });
  }
});

// User-Role assignment endpoints
app.post('/user-roles', async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    const assigned = await storage.assignRoleToUser(userId, roleId);
    if (!assigned) {
      return res.status(400).json({ message: 'Failed to assign role to user' });
    }
    res.status(201).json({ message: 'Role assigned successfully' });
  } catch (error) {
    console.error('Assign role error:', error);
    res.status(500).json({ message: 'Failed to assign role' });
  }
});

app.delete('/user-roles', async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    const removed = await storage.removeRoleFromUser(userId, roleId);
    if (!removed) {
      return res.status(404).json({ message: 'Role assignment not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Remove role error:', error);
    res.status(500).json({ message: 'Failed to remove role' });
  }
});

app.get('/users/:userId/roles', async (req, res) => {
  try {
    const { userId } = req.params;
    const roles = await storage.getUserRoles(userId);
    res.json(roles);
  } catch (error) {
    console.error('Get user roles error:', error);
    res.status(500).json({ message: 'Failed to fetch user roles' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'user-service', status: 'healthy', port: PORT });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`👥 User Service running on port ${PORT}`);
  });
}

module.exports = app;