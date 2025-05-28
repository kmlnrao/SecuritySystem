import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.USER_SERVICE_PORT || 3002;

app.use(cors());
app.use(express.json());

// Users CRUD
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { username, email, password, isActive } = req.body;
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,
        isActive: isActive !== undefined ? isActive : true
      }
    });
    res.status(201).json(user);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.update({
      where: { id },
      data: req.body
    });
    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Roles CRUD
app.get('/roles', async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        userRoles: {
          include: {
            user: true
          }
        }
      }
    });
    res.json(roles);
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ message: 'Failed to fetch roles' });
  }
});

app.post('/roles', async (req, res) => {
  try {
    const { name } = req.body;
    const role = await prisma.role.create({
      data: { name }
    });
    res.status(201).json(role);
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({ message: 'Failed to create role' });
  }
});

app.put('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const role = await prisma.role.update({
      where: { id },
      data: req.body
    });
    res.json(role);
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Failed to update role' });
  }
});

app.delete('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.role.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({ message: 'Failed to delete role' });
  }
});

// User-Role assignments
app.post('/user-roles', async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    const userRole = await prisma.userRole.create({
      data: { userId, roleId },
      include: {
        user: true,
        role: true
      }
    });
    res.status(201).json(userRole);
  } catch (error) {
    console.error('Assign role error:', error);
    res.status(500).json({ message: 'Failed to assign role to user' });
  }
});

app.delete('/user-roles/:userId/:roleId', async (req, res) => {
  try {
    const { userId, roleId } = req.params;
    await prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId
        }
      }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Remove role error:', error);
    res.status(500).json({ message: 'Failed to remove role from user' });
  }
});

app.get('/users/:userId/roles', async (req, res) => {
  try {
    const { userId } = req.params;
    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      include: { role: true }
    });
    res.json(userRoles.map(ur => ur.role));
  } catch (error) {
    console.error('Get user roles error:', error);
    res.status(500).json({ message: 'Failed to fetch user roles' });
  }
});

app.get('/health', (req, res) => {
  res.json({ service: 'user-service', status: 'healthy', port: PORT });
});

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`👥 User Service running on port ${PORT}`);
  });
}

export default app;