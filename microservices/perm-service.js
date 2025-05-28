const express = require('express');
const cors = require('cors');
const { storage } = require('../server/storage');
const { db } = require('../server/db');
const { permissions, documents, modules, moduleDocuments } = require('../shared/schema');
const { eq, or } = require('drizzle-orm');

const app = express();
const PORT = process.env.PERM_SERVICE_PORT || 3004;

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
}));
app.use(express.json());

// Assign permissions to user
app.post('/permissions/user', async (req, res) => {
  try {
    const { userId, documentId, canAdd, canModify, canDelete, canQuery } = req.body;
    
    const permission = await storage.createPermission({
      userId,
      documentId,
      canAdd: canAdd || false,
      canModify: canModify || false,
      canDelete: canDelete || false,
      canQuery: canQuery || false
    });
    
    res.status(201).json(permission);
  } catch (error) {
    console.error('Create user permission error:', error);
    res.status(500).json({ message: 'Failed to create user permission' });
  }
});

// Assign permissions to role
app.post('/permissions/role', async (req, res) => {
  try {
    const { roleId, documentId, canAdd, canModify, canDelete, canQuery } = req.body;
    
    const permission = await storage.createPermission({
      roleId,
      documentId,
      canAdd: canAdd || false,
      canModify: canModify || false,
      canDelete: canDelete || false,
      canQuery: canQuery || false
    });
    
    res.status(201).json(permission);
  } catch (error) {
    console.error('Create role permission error:', error);
    res.status(500).json({ message: 'Failed to create role permission' });
  }
});

// Get user permissions (both direct and through roles)
app.get('/permissions/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user roles
    const userRoles = await storage.getUserRoles(userId);
    const roleIds = userRoles.map(role => role.id);
    
    // Get direct user permissions
    const userPermissions = await storage.getUserPermissions(userId);
    
    // Get role-based permissions
    let rolePermissions = [];
    for (const roleId of roleIds) {
      const rolePerms = await storage.getRolePermissions(roleId);
      rolePermissions = [...rolePermissions, ...rolePerms];
    }
    
    // Combine and deduplicate permissions
    const allPermissions = [...userPermissions, ...rolePermissions];
    const uniquePermissions = allPermissions.reduce((acc, perm) => {
      const key = `${perm.documentId}`;
      if (!acc[key]) {
        acc[key] = perm;
      } else {
        // Merge permissions (OR logic - if any permission allows, then allow)
        acc[key] = {
          ...acc[key],
          canAdd: acc[key].canAdd || perm.canAdd,
          canModify: acc[key].canModify || perm.canModify,
          canDelete: acc[key].canDelete || perm.canDelete,
          canQuery: acc[key].canQuery || perm.canQuery
        };
      }
      return acc;
    }, {});
    
    res.json(Object.values(uniquePermissions));
  } catch (error) {
    console.error('Get user permissions error:', error);
    res.status(500).json({ message: 'Failed to fetch user permissions' });
  }
});

// Get navigation menu structure for user
app.get('/user/navigation/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user roles
    const userRoles = await storage.getUserRoles(userId);
    const roleIds = userRoles.map(role => role.id);
    
    // Get all permissions for user (direct + role-based)
    const userPermissions = await storage.getUserPermissions(userId);
    let rolePermissions = [];
    
    for (const roleId of roleIds) {
      const rolePerms = await storage.getRolePermissions(roleId);
      rolePermissions = [...rolePermissions, ...rolePerms];
    }
    
    // Get all accessible documents
    const allPermissions = [...userPermissions, ...rolePermissions];
    const accessibleDocumentIds = [...new Set(allPermissions.map(p => p.documentId))];
    
    if (accessibleDocumentIds.length === 0) {
      return res.json({ modules: [], navigation: [] });
    }
    
    // Get documents with their modules
    const documentsWithModules = await db
      .select({
        document: documents,
        module: modules
      })
      .from(documents)
      .leftJoin(moduleDocuments, eq(documents.id, moduleDocuments.documentId))
      .leftJoin(modules, eq(moduleDocuments.moduleId, modules.id))
      .where(or(...accessibleDocumentIds.map(id => eq(documents.id, id))));
    
    // Build navigation structure
    const navigationMap = new Map();
    
    documentsWithModules.forEach(({ document, module }) => {
      if (module) {
        if (!navigationMap.has(module.id)) {
          navigationMap.set(module.id, {
            id: module.id,
            name: module.name,
            documents: []
          });
        }
        navigationMap.get(module.id).documents.push({
          id: document.id,
          name: document.name,
          path: document.path
        });
      }
    });
    
    const navigation = Array.from(navigationMap.values());
    
    res.json({
      userId,
      roles: userRoles.map(role => role.name),
      modules: navigation,
      navigation: navigation.map(nav => ({
        module: nav.name,
        documents: nav.documents.map(doc => ({
          name: doc.name,
          path: doc.path
        }))
      }))
    });
  } catch (error) {
    console.error('Get user navigation error:', error);
    res.status(500).json({ message: 'Failed to fetch user navigation' });
  }
});

// Update permission
app.put('/permissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const permission = await storage.updatePermission(id, req.body);
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }
    res.json(permission);
  } catch (error) {
    console.error('Update permission error:', error);
    res.status(500).json({ message: 'Failed to update permission' });
  }
});

// Delete permission
app.delete('/permissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await storage.deletePermission(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Permission not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Delete permission error:', error);
    res.status(500).json({ message: 'Failed to delete permission' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'perm-service', status: 'healthy', port: PORT });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🔐 Perm Service running on port ${PORT}`);
  });
}

module.exports = app;