import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertUserSchema, insertRoleSchema, insertModuleSchema, insertDocumentSchema, insertPermissionSchema, moduleDocuments, documents } from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
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
      const userData = insertUserSchema.parse(req.body);
      
      // Hash the password before storing
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const userWithHashedPassword = {
        ...userData,
        password: hashedPassword
      };
      
      const user = await storage.createUser(userWithHashedPassword);
      res.status(201).json(user);
    } catch (error) {
      console.error('Create user error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const userData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, userData);
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
      const deleted = await storage.deleteUser(id);
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
      const roleData = insertRoleSchema.parse(req.body);
      const role = await storage.createRole(roleData);
      res.status(201).json(role);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid role data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create role" });
    }
  });

  app.put("/api/roles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const roleData = insertRoleSchema.partial().parse(req.body);
      const role = await storage.updateRole(id, roleData);
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.json(role);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid role data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update role" });
    }
  });

  app.delete("/api/roles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteRole(id);
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
      const module = await storage.createModule(moduleData);
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
      const module = await storage.updateModule(id, moduleData);
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
      const deleted = await storage.deleteModule(id);
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
      
      // Get user permissions once
      const userPermissions = await storage.getUserPermissions(userId);
      
      // Build navigation based on user permissions and module-document relationships
      const navigation = [];
      
      for (const module of allModules) {
        const moduleDocsList = [];
        
        // Get documents that belong to this specific module using storage method
        const moduleDocumentLinks = await storage.getModuleDocuments(module.id);
        
        for (const documentId of moduleDocumentLinks) {
          const document = await storage.getDocument(documentId);
          if (!document) continue;
          
          // Check if user has permissions for this document
          const documentPermissions = userPermissions.filter(p => p.documentId === document.id);
          
          // Check if user has explicit permissions for this document
          if (documentPermissions.length > 0) {
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
          // If no explicit permissions exist and user is superadmin, grant access
          // This is a fallback for when permissions haven't been set up yet
          else if ((user.username === 'superadmin' || userRoles.some(role => role.name === 'Super Admin')) && userPermissions.length === 0) {
            moduleDocsList.push({
              id: document.id,
              name: document.name,
              path: document.path,
              permissions: {
                canAdd: true,
                canModify: true,
                canDelete: true,
                canQuery: true
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
      const document = await storage.createDocument(documentData);
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
      const document = await storage.updateDocument(id, documentData);
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
      const deleted = await storage.deleteDocument(id);
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
      const permission = await storage.createPermission(permissionData);
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
      const permission = await storage.updatePermission(id, permissionData);
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
      const deleted = await storage.deletePermission(id);
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

  app.get("/api/roles/:roleId/permissions", async (req, res) => {
    try {
      const { roleId } = req.params;
      const permissions = await storage.getRolePermissions(roleId);
      res.json(permissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch role permissions" });
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

      // Create module-document relationships
      await storage.assignModuleDocument(patientModule.id, patientRegDoc.id);
      await storage.assignModuleDocument(patientModule.id, medicalHistoryDoc.id);
      await storage.assignModuleDocument(medicalModule.id, medicalHistoryDoc.id);
      await storage.assignModuleDocument(medicalModule.id, prescriptionDoc.id);
      await storage.assignModuleDocument(appointmentModule.id, appointmentDoc.id);
      await storage.assignModuleDocument(billingModule.id, billingDoc.id);
      await storage.assignModuleDocument(inventoryModule.id, inventoryDoc.id);

      // Create permissions for Administrator role (full access)
      const documents = [patientRegDoc, medicalHistoryDoc, prescriptionDoc, appointmentDoc, billingDoc, inventoryDoc];
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

      res.json({ 
        message: "Database seeded successfully",
        summary: {
          roles: 5,
          modules: 5,
          documents: 6,
          permissions: 19
        }
      });
    } catch (error) {
      console.error("Seed error:", error);
      res.status(500).json({ message: "Failed to seed database", error: error instanceof Error ? error.message : String(error) });
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
      
      // Get all modules and documents
      const modules = await storage.getAllModules();
      const documents = await storage.getAllDocuments();
      
      // Build navigation structure
      const navigation = modules.map(module => {
        // Get documents for this module (for now, filter by module association)
        let moduleDocuments = documents.filter(doc => {
          // Simple mapping based on module and document names
          if (module.name === 'Patient Management') {
            return doc.name.includes('Patient') || doc.name.includes('Register');
          }
          if (module.name === 'Medical Records') {
            return doc.name.includes('Medical') || doc.name.includes('Records');
          }
          if (module.name === 'Appointments') {
            return doc.name.includes('Appointment') || doc.name.includes('Schedule');
          }
          if (module.name === 'Pharmacy') {
            return doc.name.includes('Pharmacy') || doc.name.includes('Prescription');
          }
          if (module.name === 'Laboratory') {
            return doc.name.includes('Lab') || doc.name.includes('Test');
          }
          return false;
        }).map(doc => ({
          id: doc.id,
          name: doc.name,
          path: doc.path,
          permissions: {
            canAdd: isSuperAdmin,
            canModify: isSuperAdmin,
            canDelete: isSuperAdmin,
            canQuery: isSuperAdmin
          }
        }));

        // If no documents found for this module, add some default ones for Super Admin
        if (moduleDocuments.length === 0 && isSuperAdmin) {
          if (module.name === 'Patient Management') {
            moduleDocuments = [
              { id: 'pm1', name: 'Register Patient', path: '/patients/register', permissions: { canAdd: true, canModify: true, canDelete: true, canQuery: true } },
              { id: 'pm2', name: 'View Patients', path: '/patients', permissions: { canAdd: true, canModify: true, canDelete: true, canQuery: true } }
            ];
          } else if (module.name === 'Medical Records') {
            moduleDocuments = [
              { id: 'mr1', name: 'Patient Records', path: '/medical-records', permissions: { canAdd: true, canModify: true, canDelete: true, canQuery: true } },
              { id: 'mr2', name: 'Medical History', path: '/medical-history', permissions: { canAdd: true, canModify: true, canDelete: true, canQuery: true } }
            ];
          } else if (module.name === 'Appointments') {
            moduleDocuments = [
              { id: 'ap1', name: 'Schedule Appointment', path: '/appointments/schedule', permissions: { canAdd: true, canModify: true, canDelete: true, canQuery: true } },
              { id: 'ap2', name: 'View Appointments', path: '/appointments', permissions: { canAdd: true, canModify: true, canDelete: true, canQuery: true } }
            ];
          } else if (module.name === 'Pharmacy') {
            moduleDocuments = [
              { id: 'ph1', name: 'Prescriptions', path: '/pharmacy/prescriptions', permissions: { canAdd: true, canModify: true, canDelete: true, canQuery: true } },
              { id: 'ph2', name: 'Medicine Inventory', path: '/pharmacy/inventory', permissions: { canAdd: true, canModify: true, canDelete: true, canQuery: true } }
            ];
          } else if (module.name === 'Laboratory') {
            moduleDocuments = [
              { id: 'lb1', name: 'Lab Tests', path: '/laboratory/tests', permissions: { canAdd: true, canModify: true, canDelete: true, canQuery: true } },
              { id: 'lb2', name: 'Test Results', path: '/laboratory/results', permissions: { canAdd: true, canModify: true, canDelete: true, canQuery: true } }
            ];
          }
        }

        return {
          id: module.id,
          name: module.name,
          documents: moduleDocuments
        };
      }).filter(module => module.documents.length > 0);

      res.json(navigation);
    } catch (error) {
      console.error('Navigation error:', error);
      res.status(500).json({ message: "Failed to fetch navigation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
