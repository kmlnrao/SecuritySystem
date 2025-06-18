import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertUserSchema, insertRoleSchema, insertModuleSchema, insertDocumentSchema, insertPermissionSchema, moduleDocuments, documents } from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export function registerRoutes(app: Express): Server {
  // Health check endpoint for deployment monitoring
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      database: "connected"
    });
  });

  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // User management routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      console.log('Create user request body:', req.body);
      const userData = insertUserSchema.parse(req.body);
      console.log('Parsed user data:', userData);
      
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const userWithHashedPassword = {
        ...userData,
        password: hashedPassword
      };
      
      // Get audit information
      const auditInfo = {
        userId: req.user?.id || 'system',
        username: req.user?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent')
      };
      
      console.log('User data with hashed password:', { ...userWithHashedPassword, password: '[HASHED]' });
      const user = await storage.createUser(userWithHashedPassword, auditInfo);
      console.log('Created user:', { ...user, password: '[HIDDEN]' });
      res.status(201).json(user);
    } catch (error) {
      console.error('Create user error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Update user profile
  app.patch("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email } = req.body;

      // Check if user exists
      const existingUser = await storage.getUser(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if username/email already exists for other users
      if (username && username !== existingUser.username) {
        const userWithUsername = await storage.getUserByUsername(username);
        if (userWithUsername && userWithUsername.id !== id) {
          return res.status(400).json({ message: "Username already exists" });
        }
      }

      if (email && email !== existingUser.email) {
        const userWithEmail = await storage.getUserByEmail(email);
        if (userWithEmail && userWithEmail.id !== id) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }

      // Get audit information
      const auditInfo = {
        userId: req.user?.id || 'system',
        username: req.user?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent')
      };

      const updatedUser = await storage.updateUser(id, { username, email }, auditInfo);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Change user password
  app.patch("/api/users/:id/change-password", async (req, res) => {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      // Get user
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Get audit information
      const auditInfo = {
        userId: req.user?.id || 'system',
        username: req.user?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent')
      };

      // Update password
      await storage.updateUser(id, { password: hashedNewPassword }, auditInfo);
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const userData = insertUserSchema.partial().parse(req.body);
      
      // Get audit information
      const auditInfo = {
        userId: req.user?.id || 'system',
        username: req.user?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent')
      };
      
      const user = await storage.updateUser(id, userData, auditInfo);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get audit information
      const auditInfo = {
        userId: req.user?.id || 'system',
        username: req.user?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent')
      };
      
      const deleted = await storage.deleteUser(id, auditInfo);
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Role management routes
  app.get("/api/roles", async (req, res) => {
    try {
      const roles = await storage.getAllRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  });

  app.post("/api/roles", async (req, res) => {
    try {
      console.log('Create role request body:', req.body);
      const roleData = insertRoleSchema.parse(req.body);
      console.log('Parsed role data:', roleData);
      
      // Get audit information
      const auditInfo = {
        userId: req.user?.id || 'system',
        username: req.user?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent')
      };
      
      const role = await storage.createRole(roleData, auditInfo);
      console.log('Created role:', role);
      res.status(201).json(role);
    } catch (error) {
      console.error('Create role error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid role data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create role" });
    }
  });

  app.put("/api/roles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log('Update role request - ID:', id, 'Body:', req.body);
      const roleData = insertRoleSchema.partial().parse(req.body);
      console.log('Parsed role data for update:', roleData);
      
      // Get audit information
      const auditInfo = {
        userId: req.user?.id || 'system',
        username: req.user?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent')
      };
      
      const role = await storage.updateRole(id, roleData, auditInfo);
      console.log('Updated role result:', role);
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.json(role);
    } catch (error) {
      console.error('Update role error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid role data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update role" });
    }
  });

  app.delete("/api/roles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get audit information
      const auditInfo = {
        userId: req.user?.id || 'system',
        username: req.user?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent')
      };
      
      const deleted = await storage.deleteRole(id, auditInfo);
      if (!deleted) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete role" });
    }
  });

  // User-Role assignment routes
  app.post("/api/users/:userId/roles/:roleId", async (req, res) => {
    try {
      const { userId, roleId } = req.params;
      const assigned = await storage.assignRoleToUser(userId, roleId);
      if (!assigned) {
        return res.status(400).json({ message: "Failed to assign role to user" });
      }
      res.status(201).json({ message: "Role assigned successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to assign role" });
    }
  });

  app.delete("/api/users/:userId/roles/:roleId", async (req, res) => {
    try {
      const { userId, roleId } = req.params;
      const removed = await storage.removeRoleFromUser(userId, roleId);
      if (!removed) {
        return res.status(404).json({ message: "Role assignment not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove role" });
    }
  });

  app.get("/api/users/:userId/roles", async (req, res) => {
    try {
      const { userId } = req.params;
      const roles = await storage.getUserRoles(userId);
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user roles" });
    }
  });

  // Module management routes
  app.get("/api/modules", async (req, res) => {
    try {
      const modules = await storage.getAllModules();
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  app.post("/api/modules", async (req, res) => {
    try {
      const moduleData = insertModuleSchema.parse(req.body);
      
      // Get audit information
      const auditInfo = {
        userId: req.user?.id || 'system',
        username: req.user?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent')
      };
      
      const module = await storage.createModule(moduleData, auditInfo);
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid module data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create module" });
    }
  });

  app.put("/api/modules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const moduleData = insertModuleSchema.partial().parse(req.body);
      
      // Get audit information
      const auditInfo = {
        userId: req.user?.id || 'system',
        username: req.user?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent')
      };
      
      const module = await storage.updateModule(id, moduleData, auditInfo);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      res.json(module);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid module data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update module" });
    }
  });

  app.delete("/api/modules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get audit information
      const auditInfo = {
        userId: req.user?.id || 'system',
        username: req.user?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent')
      };
      
      const deleted = await storage.deleteModule(id, auditInfo);
      if (!deleted) {
        return res.status(404).json({ message: "Module not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete module" });
    }
  });

  // Document management routes
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getAllDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // User navigation based on permissions
  app.get("/api/users/:userId/navigation", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Get user and roles
      const user = await storage.getUser(userId);
      const userRoles = await storage.getUserRoles(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get all modules
      const allModules = await storage.getAllModules();
      
      // Get user permissions (direct + role-based)
      const userPermissions = await storage.getUserPermissions(userId);
      let allPermissions = [...userPermissions];
      
      // Add role-based permissions
      for (const role of userRoles) {
        const rolePermissions = await storage.getRolePermissions(role.id);
        allPermissions = [...allPermissions, ...rolePermissions];
      }
      
      // Build navigation based on user permissions and module-document relationships
      const navigation = [];
      
      for (const module of allModules) {
        const moduleDocsList = [];
        
        // Get documents that belong to this specific module using storage method
        const moduleDocumentLinks = await storage.getModuleDocuments(module.id);
        
        for (const documentId of moduleDocumentLinks) {
          const document = await storage.getDocument(documentId);
          if (!document) continue;
          
          // Check if user is superadmin first
          const isSuperAdmin = user.username === 'superadmin' || userRoles.some(role => role.name === 'Super Admin');
          
          // Check if user has permissions for this document (direct or role-based)
          const documentPermissions = allPermissions.filter(p => p.documentId === document.id);
          
          // If user is superadmin, grant access to all documents
          if (isSuperAdmin) {
            const docPermission = documentPermissions.length > 0 ? documentPermissions[0] : null;
            moduleDocsList.push({
              id: document.id,
              name: document.name,
              path: document.path,
              permissions: {
                canAdd: docPermission?.canAdd ?? true,
                canModify: docPermission?.canModify ?? true,
                canDelete: docPermission?.canDelete ?? true,
                canQuery: docPermission?.canQuery ?? true
              }
            });
          }
          // Check if user has explicit permissions for this document
          else if (documentPermissions.length > 0) {
            const docPermission = documentPermissions[0];
            moduleDocsList.push({
              id: document.id,
              name: document.name,
              path: document.path,
              permissions: {
                canAdd: docPermission.canAdd || false,
                canModify: docPermission.canModify || false,
                canDelete: docPermission.canDelete || false,
                canQuery: docPermission.canQuery || false
              }
            });
          }
        }
        
        // Only include module if it has accessible documents
        if (moduleDocsList.length > 0) {
          navigation.push({
            id: module.id,
            name: module.name,
            documents: moduleDocsList
          });
        }
      }
      
      res.json(navigation);
    } catch (error) {
      console.error("Error fetching user navigation:", error);
      res.status(500).json({ message: "Failed to fetch navigation" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      
      // Get audit information
      const auditInfo = {
        userId: req.user?.id || 'system',
        username: req.user?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent')
      };
      
      const document = await storage.createDocument(documentData, auditInfo);
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  app.put("/api/documents/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const documentData = insertDocumentSchema.partial().parse(req.body);
      
      // Get audit information
      const auditInfo = {
        userId: req.user?.id || 'system',
        username: req.user?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent')
      };
      
      const document = await storage.updateDocument(id, documentData, auditInfo);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update document" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get audit information
      const auditInfo = {
        userId: req.user?.id || 'system',
        username: req.user?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent')
      };
      
      const deleted = await storage.deleteDocument(id, auditInfo);
      if (!deleted) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Permission management routes
  app.post("/api/permissions", async (req, res) => {
    try {
      const permissionData = insertPermissionSchema.parse(req.body);
      
      // Get audit information
      const auditInfo = {
        userId: req.user?.id || 'system',
        username: req.user?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent')
      };
      
      const permission = await storage.createPermission(permissionData, auditInfo);
      res.status(201).json(permission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid permission data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create permission" });
    }
  });

  app.put("/api/permissions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const permissionData = insertPermissionSchema.partial().parse(req.body);
      
      // Get audit information
      const auditInfo = {
        userId: req.user?.id || 'system',
        username: req.user?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent')
      };
      
      const permission = await storage.updatePermission(id, permissionData, auditInfo);
      if (!permission) {
        return res.status(404).json({ message: "Permission not found" });
      }
      res.json(permission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid permission data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update permission" });
    }
  });

  app.delete("/api/permissions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get audit information
      const auditInfo = {
        userId: req.user?.id || 'system',
        username: req.user?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent')
      };
      
      const deleted = await storage.deletePermission(id, auditInfo);
      if (!deleted) {
        return res.status(404).json({ message: "Permission not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete permission" });
    }
  });

  app.get("/api/users/:userId/permissions", async (req, res) => {
    try {
      const { userId } = req.params;
      const permissions = await storage.getUserPermissions(userId);
      res.json(permissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user permissions" });
    }
  });

  app.get("/api/users/:userId/roles", async (req, res) => {
    try {
      const { userId } = req.params;
      const roles = await storage.getUserRoles(userId);
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user roles" });
    }
  });

  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const totalUsers = await storage.getAllUsers();
      const totalRoles = await storage.getAllRoles();
      const totalDocuments = await storage.getAllDocuments();
      const totalModules = await storage.getAllModules();
      
      res.json({
        totalUsers: totalUsers.length,
        totalRoles: totalRoles.length,
        totalDocuments: totalDocuments.length,
        totalModules: totalModules.length,
        activePatients: Math.floor(totalUsers.length * 0.7), // Simulated based on users
        todayAppointments: Math.floor(Math.random() * 20) + 5, // Simulated
        pendingTasks: Math.floor(Math.random() * 10) + 2 // Simulated
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });

  app.get("/api/roles/:roleId/permissions", async (req, res) => {
    try {
      const { roleId } = req.params;
      const permissions = await storage.getRolePermissions(roleId);
      res.json(permissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch role permissions" });
    }
  });

  // Module-Document mapping routes
  app.get("/api/module-documents", async (req, res) => {
    try {
      const modules = await storage.getAllModules();
      const documents = await storage.getAllDocuments();
      const mappings = [];

      for (const module of modules) {
        const documentIds = await storage.getModuleDocuments(module.id);
        for (const documentId of documentIds) {
          const document = documents.find(d => d.id === documentId);
          if (document) {
            mappings.push({
              moduleId: module.id,
              documentId: document.id,
              moduleName: module.name,
              documentName: document.name,
              documentPath: document.path
            });
          }
        }
      }

      res.json(mappings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch module-document mappings" });
    }
  });

  app.post("/api/module-documents", async (req, res) => {
    try {
      const { moduleId, documentId } = req.body;
      
      if (!moduleId || !documentId) {
        return res.status(400).json({ message: "Module ID and Document ID are required" });
      }

      const success = await storage.assignModuleDocument(moduleId, documentId);
      if (success) {
        res.status(201).json({ message: "Document assigned to module successfully" });
      } else {
        res.status(400).json({ message: "Failed to assign document to module" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to create module-document mapping" });
    }
  });

  app.delete("/api/module-documents/:moduleId/:documentId", async (req, res) => {
    try {
      const { moduleId, documentId } = req.params;
      const success = await storage.removeModuleDocument(moduleId, documentId);
      
      if (success) {
        res.json({ message: "Document removed from module successfully" });
      } else {
        res.status(404).json({ message: "Mapping not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to remove module-document mapping" });
    }
  });

  // Audit log retrieval endpoints
  app.get("/api/audit-logs", async (req, res) => {
    try {
      const { tableName, recordId } = req.query;
      const auditLogs = await storage.getAuditLogs(
        tableName as string, 
        recordId as string
      );
      res.json(auditLogs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  app.get("/api/audit-logs/:tableName", async (req, res) => {
    try {
      const { tableName } = req.params;
      const { recordId } = req.query;
      const auditLogs = await storage.getAuditLogs(
        tableName, 
        recordId as string
      );
      res.json(auditLogs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // Seed database endpoint
  app.post("/api/seed", async (req, res) => {
    try {
      // Create roles
      const adminRole = await storage.createRole({ name: "Administrator" });
      const doctorRole = await storage.createRole({ name: "Doctor" });
      const nurseRole = await storage.createRole({ name: "Nurse" });
      const staffRole = await storage.createRole({ name: "Staff" });
      const receptionistRole = await storage.createRole({ name: "Receptionist" });

      // Create modules
      const patientModule = await storage.createModule({ name: "Patient Management" });
      const appointmentModule = await storage.createModule({ name: "Appointment Scheduling" });
      const medicalModule = await storage.createModule({ name: "Medical Records" });
      const billingModule = await storage.createModule({ name: "Billing & Insurance" });
      const inventoryModule = await storage.createModule({ name: "Inventory Management" });
      const mastersModule = await storage.createModule({ name: "Masters" });

      // Create documents
      const patientRegDoc = await storage.createDocument({ 
        name: "Patient Registration Form", 
        path: "/patient/register" 
      });
      const medicalHistoryDoc = await storage.createDocument({ 
        name: "Medical History", 
        path: "/patient/history" 
      });
      const prescriptionDoc = await storage.createDocument({ 
        name: "Prescription Form", 
        path: "/medical/prescription" 
      });
      const appointmentDoc = await storage.createDocument({ 
        name: "Appointment Schedule", 
        path: "/appointment/schedule" 
      });
      const billingDoc = await storage.createDocument({ 
        name: "Billing Statement", 
        path: "/billing/statement" 
      });
      const inventoryDoc = await storage.createDocument({ 
        name: "Inventory Report", 
        path: "/inventory/report" 
      });
      const masterTablesDoc = await storage.createDocument({ 
        name: "Master Tables", 
        path: "/masters" 
      });

      // Create module-document relationships
      await storage.assignModuleDocument(patientModule.id, patientRegDoc.id);
      await storage.assignModuleDocument(patientModule.id, medicalHistoryDoc.id);
      await storage.assignModuleDocument(medicalModule.id, medicalHistoryDoc.id);
      await storage.assignModuleDocument(medicalModule.id, prescriptionDoc.id);
      await storage.assignModuleDocument(appointmentModule.id, appointmentDoc.id);
      await storage.assignModuleDocument(billingModule.id, billingDoc.id);
      await storage.assignModuleDocument(inventoryModule.id, inventoryDoc.id);
      await storage.assignModuleDocument(mastersModule.id, masterTablesDoc.id);

      // Create permissions for Administrator role (full access)
      const documents = [patientRegDoc, medicalHistoryDoc, prescriptionDoc, appointmentDoc, billingDoc, inventoryDoc, masterTablesDoc];
      for (const doc of documents) {
        await storage.createPermission({
          roleId: adminRole.id,
          documentId: doc.id,
          canAdd: true,
          canModify: true,
          canDelete: true,
          canQuery: true,
        });
      }

      // Create permissions for Doctor role
      await storage.createPermission({
        roleId: doctorRole.id,
        documentId: patientRegDoc.id,
        canAdd: true,
        canModify: true,
        canDelete: false,
        canQuery: true,
      });
      await storage.createPermission({
        roleId: doctorRole.id,
        documentId: medicalHistoryDoc.id,
        canAdd: true,
        canModify: true,
        canDelete: false,
        canQuery: true,
      });
      await storage.createPermission({
        roleId: doctorRole.id,
        documentId: prescriptionDoc.id,
        canAdd: true,
        canModify: true,
        canDelete: true,
        canQuery: true,
      });
      await storage.createPermission({
        roleId: doctorRole.id,
        documentId: appointmentDoc.id,
        canAdd: false,
        canModify: true,
        canDelete: false,
        canQuery: true,
      });

      // Create permissions for Nurse role
      await storage.createPermission({
        roleId: nurseRole.id,
        documentId: patientRegDoc.id,
        canAdd: true,
        canModify: true,
        canDelete: false,
        canQuery: true,
      });
      await storage.createPermission({
        roleId: nurseRole.id,
        documentId: medicalHistoryDoc.id,
        canAdd: true,
        canModify: false,
        canDelete: false,
        canQuery: true,
      });
      await storage.createPermission({
        roleId: nurseRole.id,
        documentId: appointmentDoc.id,
        canAdd: true,
        canModify: true,
        canDelete: false,
        canQuery: true,
      });

      // Create permissions for Staff role
      await storage.createPermission({
        roleId: staffRole.id,
        documentId: billingDoc.id,
        canAdd: true,
        canModify: true,
        canDelete: false,
        canQuery: true,
      });
      await storage.createPermission({
        roleId: staffRole.id,
        documentId: inventoryDoc.id,
        canAdd: true,
        canModify: true,
        canDelete: false,
        canQuery: true,
      });

      // Create permissions for Receptionist role
      await storage.createPermission({
        roleId: receptionistRole.id,
        documentId: patientRegDoc.id,
        canAdd: true,
        canModify: true,
        canDelete: false,
        canQuery: true,
      });
      await storage.createPermission({
        roleId: receptionistRole.id,
        documentId: appointmentDoc.id,
        canAdd: true,
        canModify: true,
        canDelete: true,
        canQuery: true,
      });

      // Create sample master table configurations
      const departmentConfig = await storage.createMasterTableConfig({
        tableName: "department",
        displayName: "Department Master",
        description: "Manage hospital departments and their details",
        columns: JSON.stringify([
          { name: "name", type: "text", required: true, maxLength: 100 },
          { name: "code", type: "text", required: true, maxLength: 10 },
          { name: "description", type: "text", required: false, maxLength: 500 },
          { name: "head_of_department", type: "text", required: false, maxLength: 100 },
          { name: "phone", type: "text", required: false, maxLength: 20 },
          { name: "email", type: "email", required: false },
          { name: "is_active", type: "boolean", required: true }
        ])
      });

      // Create sample department records
      const sampleDepartments = [
        {
          name: "Cardiology",
          code: "CARD",
          description: "Heart and cardiovascular system treatment",
          head_of_department: "Dr. Sarah Johnson",
          phone: "555-0101",
          email: "cardiology@hospital.com",
          is_active: true
        },
        {
          name: "Neurology",
          code: "NEURO",
          description: "Brain and nervous system treatment",
          head_of_department: "Dr. Michael Chen",
          phone: "555-0102",
          email: "neurology@hospital.com",
          is_active: true
        },
        {
          name: "Pediatrics",
          code: "PEDS",
          description: "Children's healthcare services",
          head_of_department: "Dr. Emily Davis",
          phone: "555-0103",
          email: "pediatrics@hospital.com",
          is_active: true
        }
      ];

      for (const dept of sampleDepartments) {
        await storage.createMasterDataRecord({
          tableId: departmentConfig.id,
          recordData: JSON.stringify(dept)
        });
      }

      res.json({ 
        message: "Database seeded successfully",
        summary: {
          roles: 5,
          modules: 6,
          documents: 7,
          permissions: 21,
          masterTables: 1,
          masterRecords: 3
        }
      });
    } catch (error) {
      console.error("Seed error:", error);
      res.status(500).json({ message: "Failed to seed database", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Permission management routes
  app.get("/api/permissions", async (req, res) => {
    try {
      const permissions = await storage.getAllPermissions();
      res.json(permissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch permissions" });
    }
  });

  app.post("/api/permissions", async (req, res) => {
    try {
      const validatedData = insertPermissionSchema.parse(req.body);
      const permission = await storage.createPermission(validatedData);
      res.status(201).json(permission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create permission" });
    }
  });

  app.put("/api/permissions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertPermissionSchema.partial().parse(req.body);
      const permission = await storage.updatePermission(id, validatedData);
      if (!permission) {
        return res.status(404).json({ message: "Permission not found" });
      }
      res.json(permission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update permission" });
    }
  });

  app.delete("/api/permissions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePermission(id);
      if (deleted) {
        res.status(200).json({ message: "Permission deleted successfully" });
      } else {
        res.status(404).json({ message: "Permission not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete permission" });
    }
  });

  // Navigation endpoint for sidebar
  app.get("/api/users/:userId/navigation", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Get user with roles
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userRoles = await storage.getUserRoles(userId);
      const isSuperAdmin = userRoles.some(role => role.name === 'Super Admin');
      
      // Get all modules ordered by display_order
      const modules = await storage.getAllModules();
      
      // Build navigation structure using proper module-document relationships
      const navigation = [];
      
      for (const module of modules) {
        // Get documents for this module
        const moduleDocumentIds = await storage.getModuleDocuments(module.id);
        
        if (moduleDocumentIds.length === 0) continue;
        
        const moduleDocuments = [];
        
        for (const documentId of moduleDocumentIds) {
          const document = await storage.getDocument(documentId);
          if (!document) continue;
          
          // Check permissions
          let hasPermission = false;
          let permissions = { canAdd: false, canModify: false, canDelete: false, canQuery: false };
          
          if (isSuperAdmin) {
            hasPermission = true;
            permissions = { canAdd: true, canModify: true, canDelete: true, canQuery: true };
          } else {
            // Check user permissions
            const userPermissions = await storage.getUserPermissions(userId);
            const userPermission = userPermissions.find(p => p.documentId === document.id);
            
            if (userPermission) {
              hasPermission = userPermission.canQuery;
              permissions = {
                canAdd: userPermission.canAdd,
                canModify: userPermission.canModify,
                canDelete: userPermission.canDelete,
                canQuery: userPermission.canQuery
              };
            } else {
              // Check role permissions
              for (const role of userRoles) {
                const rolePermissions = await storage.getRolePermissions(role.id);
                const rolePermission = rolePermissions.find(p => p.documentId === document.id);
                
                if (rolePermission && rolePermission.canQuery) {
                  hasPermission = true;
                  permissions = {
                    canAdd: permissions.canAdd || rolePermission.canAdd,
                    canModify: permissions.canModify || rolePermission.canModify,
                    canDelete: permissions.canDelete || rolePermission.canDelete,
                    canQuery: permissions.canQuery || rolePermission.canQuery
                  };
                  break;
                }
              }
            }
          }
          
          if (hasPermission) {
            moduleDocuments.push({
              id: document.id,
              name: document.name,
              path: document.path,
              permissions
            });
          }
        }
        
        if (moduleDocuments.length > 0) {
          navigation.push({
            id: module.id,
            name: module.name,
            documents: moduleDocuments
          });
        }
      }
      
      // Navigation is already sorted by display_order from the database query

      res.json(navigation);
    } catch (error) {
      console.error('Navigation error:', error);
      res.status(500).json({ message: "Failed to fetch navigation" });
    }
  });

  // Master Table Configuration routes
  app.get("/api/master-tables", async (req, res) => {
    try {
      const configs = await storage.getAllMasterTableConfigs();
      res.json(configs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch master table configurations" });
    }
  });

  app.post("/api/master-tables", async (req, res) => {
    try {
      const auditInfo = {
        userId: (req.user as any)?.id || 'system',
        username: (req.user as any)?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || undefined
      };
      
      const config = await storage.createMasterTableConfig(req.body, auditInfo);
      res.status(201).json(config);
    } catch (error) {
      res.status(500).json({ message: "Failed to create master table configuration" });
    }
  });

  app.get("/api/master-tables/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const config = await storage.getMasterTableConfig(id);
      if (!config) {
        return res.status(404).json({ message: "Master table configuration not found" });
      }
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch master table configuration" });
    }
  });

  app.put("/api/master-tables/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const auditInfo = {
        userId: (req.user as any)?.id || 'system',
        username: (req.user as any)?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || undefined
      };
      
      const config = await storage.updateMasterTableConfig(id, req.body, auditInfo);
      if (!config) {
        return res.status(404).json({ message: "Master table configuration not found" });
      }
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: "Failed to update master table configuration" });
    }
  });

  app.delete("/api/master-tables/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const auditInfo = {
        userId: (req.user as any)?.id || 'system',
        username: (req.user as any)?.username || 'system',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || undefined
      };
      
      const deleted = await storage.deleteMasterTableConfig(id, auditInfo);
      if (!deleted) {
        return res.status(404).json({ message: "Master table configuration not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete master table configuration" });
    }
  });

  // Master Data Records routes
  app.get("/api/master-tables/:tableId/records", async (req, res) => {
    try {
      const { tableId } = req.params;
      const records = await storage.getMasterDataRecordsByTableId(tableId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch master data records" });
    }
  });

  app.post("/api/master-tables/:tableId/records", async (req, res) => {
    try {
      const { tableId } = req.params;
      const record = await storage.createMasterDataRecord({
        tableId,
        recordData: JSON.stringify(req.body),
      });
      res.status(201).json(record);
    } catch (error) {
      res.status(500).json({ message: "Failed to create master data record" });
    }
  });

  app.get("/api/master-data-records/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const record = await storage.getMasterDataRecord(id);
      if (!record) {
        return res.status(404).json({ message: "Master data record not found" });
      }
      res.json(record);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch master data record" });
    }
  });

  app.put("/api/master-data-records/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const record = await storage.updateMasterDataRecord(id, {
        recordData: JSON.stringify(req.body),
      });
      if (!record) {
        return res.status(404).json({ message: "Master data record not found" });
      }
      res.json(record);
    } catch (error) {
      res.status(500).json({ message: "Failed to update master data record" });
    }
  });

  app.delete("/api/master-data-records/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteMasterDataRecord(id);
      if (!deleted) {
        return res.status(404).json({ message: "Master data record not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete master data record" });
    }
  });

  // Audit Log routes
  app.get("/api/audit-logs", async (req, res) => {
    try {
      const { tableName, recordId } = req.query;
      const logs = await storage.getAuditLogs(
        tableName as string, 
        recordId as string
      );
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  app.get("/api/master-tables/:id/audit-logs", async (req, res) => {
    try {
      const { id } = req.params;
      const logs = await storage.getAuditLogs("master_table_configs", id);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch master table audit logs" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
