const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.AUTH_SERVICE_PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'hospital-management-secret-key';

app.use(cors());
app.use(express.json());

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        roles: user.userRoles.map(ur => ur.role.name)
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data and token
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Token verification endpoint
app.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get updated user data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid or inactive user' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, valid: true });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token', valid: false });
  }
});

// Register endpoint (for admin use)
app.post('/register', async (req, res) => {
  try {
    const { username, email, password, isActive = true } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isActive
      }
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Protected route example
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

app.get('/health', (req, res) => {
  res.json({ service: 'auth-service', status: 'healthy', port: PORT });
});

// Super Admin initialization function
async function initializeSuperAdmin() {
  try {
    console.log('🔐 Initializing Super Admin user...');

    // Check if Super Admin role exists, create if not
    let superAdminRole = await prisma.role.findUnique({
      where: { name: 'Super Admin' }
    });

    if (!superAdminRole) {
      superAdminRole = await prisma.role.create({
        data: { name: 'Super Admin' }
      });
      console.log('✅ Created Super Admin role');
    }

    // Check if super admin user exists
    const existingSuperAdmin = await prisma.user.findUnique({
      where: { username: 'superadmin' }
    });

    if (existingSuperAdmin) {
      console.log('ℹ️  Super Admin user already exists');
      return;
    }

    // Create super admin user
    const hashedPassword = await bcrypt.hash('SuperAdmin@2024', 12);
    const superAdminUser = await prisma.user.create({
      data: {
        username: 'superadmin',
        email: 'superadmin@hospital.com',
        password: hashedPassword,
        isActive: true
      }
    });

    console.log('✅ Created Super Admin user');

    // Assign Super Admin role to user
    await prisma.userRole.create({
      data: {
        userId: superAdminUser.id,
        roleId: superAdminRole.id
      }
    });

    console.log('✅ Assigned Super Admin role');

    // Get all documents in the system
    const allDocuments = await prisma.document.findMany();

    if (allDocuments.length > 0) {
      // Create full permissions for Super Admin role on all documents
      const superAdminPermissions = allDocuments.map(doc => ({
        roleId: superAdminRole.id,
        documentId: doc.id,
        canAdd: true,
        canModify: true,
        canDelete: true,
        canQuery: true
      }));

      // Delete existing permissions for Super Admin role to avoid duplicates
      await prisma.permission.deleteMany({
        where: { roleId: superAdminRole.id }
      });

      // Create new permissions
      await prisma.permission.createMany({
        data: superAdminPermissions
      });

      console.log(`✅ Granted full permissions to ${allDocuments.length} documents`);
    }

    console.log('\n🎉 Super Admin setup completed!');
    console.log('📋 Super Admin Credentials: superadmin / SuperAdmin@2024');

  } catch (error) {
    console.error('❌ Error initializing Super Admin:', error);
  }
}

if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`🔐 Auth Service running on port ${PORT}`);
    
    // Initialize Super Admin user on startup
    await initializeSuperAdmin();
  });
}

module.exports = { app, authenticateToken };