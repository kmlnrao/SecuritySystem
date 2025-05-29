const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PERM_SERVICE_PORT || 3004;

app.use(cors());
app.use(express.json());

// Permissions CRUD
app.get('/permissions', async (req, res) => {
  try {
    const permissions = await prisma.permission.findMany({
      include: {
        user: true,
        role: true,
        document: true
      }
    });
    res.json(permissions);
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({ message: 'Failed to fetch permissions' });
  }
});

app.post('/permissions', async (req, res) => {
  try {
    const { userId, roleId, documentId, canAdd, canModify, canDelete, canQuery } = req.body;
    const permission = await prisma.permission.create({
      data: {
        userId,
        roleId,
        documentId,
        canAdd: canAdd || false,
        canModify: canModify || false,
        canDelete: canDelete || false,
        canQuery: canQuery || false
      },
      include: {
        user: true,
        role: true,
        document: true
      }
    });
    res.status(201).json(permission);
  } catch (error) {
    console.error('Create permission error:', error);
    res.status(500).json({ message: 'Failed to create permission' });
  }
});

app.put('/permissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const permission = await prisma.permission.update({
      where: { id },
      data: req.body,
      include: {
        user: true,
        role: true,
        document: true
      }
    });
    res.json(permission);
  } catch (error) {
    console.error('Update permission error:', error);
    res.status(500).json({ message: 'Failed to update permission' });
  }
});

app.delete('/permissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.permission.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Delete permission error:', error);
    res.status(500).json({ message: 'Failed to delete permission' });
  }
});

// Get user permissions (direct and through roles)
app.get('/users/:userId/permissions', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get direct user permissions
    const directPermissions = await prisma.permission.findMany({
      where: { userId },
      include: { document: true }
    });

    // Get permissions through user roles
    const userRoles = await prisma.userRole.findMany({
      where: { userId }
    });

    const rolePermissions = await prisma.permission.findMany({
      where: {
        roleId: {
          in: userRoles.map(ur => ur.roleId)
        }
      },
      include: { document: true, role: true }
    });

    // Combine and merge permissions
    const allPermissions = [...directPermissions, ...rolePermissions];
    const mergedPermissions = {};

    allPermissions.forEach(perm => {
      const docId = perm.documentId;
      if (!mergedPermissions[docId]) {
        mergedPermissions[docId] = {
          documentId: docId,
          document: perm.document,
          canAdd: false,
          canModify: false,
          canDelete: false,
          canQuery: false
        };
      }
      
      // Merge permissions (OR operation - if any permission allows, then allowed)
      mergedPermissions[docId].canAdd = mergedPermissions[docId].canAdd || perm.canAdd;
      mergedPermissions[docId].canModify = mergedPermissions[docId].canModify || perm.canModify;
      mergedPermissions[docId].canDelete = mergedPermissions[docId].canDelete || perm.canDelete;
      mergedPermissions[docId].canQuery = mergedPermissions[docId].canQuery || perm.canQuery;
    });

    res.json(Object.values(mergedPermissions));
  } catch (error) {
    console.error('Get user permissions error:', error);
    res.status(500).json({ message: 'Failed to fetch user permissions' });
  }
});

// Get role permissions
app.get('/roles/:roleId/permissions', async (req, res) => {
  try {
    const { roleId } = req.params;
    const permissions = await prisma.permission.findMany({
      where: { roleId },
      include: { document: true }
    });
    res.json(permissions);
  } catch (error) {
    console.error('Get role permissions error:', error);
    res.status(500).json({ message: 'Failed to fetch role permissions' });
  }
});

// Navigation structure based on user permissions
app.get('/users/:userId/navigation', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is Super Admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    const isSuperAdmin = user?.userRoles.some(ur => ur.role.name === 'Super Admin') || false;
    
    // Get user permissions
    const userPermissions = await fetch(`http://localhost:${PORT}/users/${userId}/permissions`);
    const permissions = await userPermissions.json();
    
    // Get all modules and documents
    const modules = await prisma.module.findMany({
      include: {
        moduleDocuments: {
          include: {
            document: true
          }
        }
      }
    });

    // Build navigation structure
    const navigation = modules.map(module => {
      const moduleDocuments = module.moduleDocuments
        .map(md => md.document)
        .filter(doc => {
          // Super Admin gets access to everything
          if (isSuperAdmin) return true;
          
          // Regular users need explicit permissions
          const permission = permissions.find(p => p.documentId === doc.id);
          return permission && permission.canQuery;
        })
        .map(doc => {
          const permission = permissions.find(p => p.documentId === doc.id);
          return {
            ...doc,
            permissions: {
              // Super Admin gets full permissions
              canAdd: isSuperAdmin || (permission && permission.canAdd),
              canModify: isSuperAdmin || (permission && permission.canModify),
              canDelete: isSuperAdmin || (permission && permission.canDelete),
              canQuery: isSuperAdmin || (permission && permission.canQuery)
            }
          };
        });

      // Only include modules that have accessible documents
      if (moduleDocuments.length > 0) {
        return {
          ...module,
          documents: moduleDocuments
        };
      }
      return null;
    }).filter(Boolean);

    res.json(navigation);
  } catch (error) {
    console.error('Get navigation error:', error);
    res.status(500).json({ message: 'Failed to fetch navigation structure' });
  }
});

// Check specific permission
app.get('/users/:userId/permissions/:documentId/:action', async (req, res) => {
  try {
    const { userId, documentId, action } = req.params;
    
    // Get user permissions for the specific document
    const userPermissions = await fetch(`http://localhost:${PORT}/users/${userId}/permissions`);
    const permissions = await userPermissions.json();
    
    const permission = permissions.find(p => p.documentId === documentId);
    
    if (!permission) {
      return res.json({ allowed: false });
    }

    const allowed = permission[`can${action.charAt(0).toUpperCase() + action.slice(1)}`] || false;
    res.json({ allowed });
  } catch (error) {
    console.error('Check permission error:', error);
    res.status(500).json({ message: 'Failed to check permission' });
  }
});

app.get('/health', (req, res) => {
  res.json({ service: 'perm-service', status: 'healthy', port: PORT });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🔒 Permission Service running on port ${PORT}`);
  });
}

module.exports = app;