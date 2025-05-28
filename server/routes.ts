import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertUserSchema, insertRoleSchema, insertModuleSchema, insertDocumentSchema, insertPermissionSchema } from "@shared/schema";
import { z } from "zod";

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
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
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

  const httpServer = createServer(app);
  return httpServer;
}
