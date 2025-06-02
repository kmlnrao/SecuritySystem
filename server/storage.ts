import { users, roles, modules, documents, permissions, userRoles, moduleDocuments, type User, type InsertUser, type Role, type InsertRole, type Module, type InsertModule, type Document, type InsertDocument, type Permission, type InsertPermission } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;

  // Role operations
  getRole(id: string): Promise<Role | undefined>;
  getRoleByName(name: string): Promise<Role | undefined>;
  createRole(role: InsertRole): Promise<Role>;
  updateRole(id: string, role: Partial<InsertRole>): Promise<Role | undefined>;
  deleteRole(id: string): Promise<boolean>;
  getAllRoles(): Promise<Role[]>;

  // User-Role operations
  assignRoleToUser(userId: string, roleId: string): Promise<boolean>;
  removeRoleFromUser(userId: string, roleId: string): Promise<boolean>;
  getUserRoles(userId: string): Promise<Role[]>;

  // Module operations
  getModule(id: string): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;
  updateModule(id: string, module: Partial<InsertModule>): Promise<Module | undefined>;
  deleteModule(id: string): Promise<boolean>;
  getAllModules(): Promise<Module[]>;

  // Document operations
  getDocument(id: string): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: string, document: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: string): Promise<boolean>;
  getAllDocuments(): Promise<Document[]>;

  // Permission operations
  getPermission(id: string): Promise<Permission | undefined>;
  createPermission(permission: InsertPermission): Promise<Permission>;
  updatePermission(id: string, permission: Partial<InsertPermission>): Promise<Permission | undefined>;
  deletePermission(id: string): Promise<boolean>;
  getAllPermissions(): Promise<Permission[]>;
  getUserPermissions(userId: string): Promise<Permission[]>;
  getRolePermissions(roleId: string): Promise<Permission[]>;

  // Module-Document operations
  assignModuleDocument(moduleId: string, documentId: string): Promise<boolean>;
  removeModuleDocument(moduleId: string, documentId: string): Promise<boolean>;
  getModuleDocuments(moduleId: string): Promise<string[]>;

  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const userWithId = {
      ...insertUser,
      id: crypto.randomUUID()
    };
    const [user] = await db
      .insert(users)
      .values(userWithId)
      .returning();
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Role operations
  async getRole(id: string): Promise<Role | undefined> {
    const [role] = await db.select().from(roles).where(eq(roles.id, id));
    return role || undefined;
  }

  async getRoleByName(name: string): Promise<Role | undefined> {
    const [role] = await db.select().from(roles).where(eq(roles.name, name));
    return role || undefined;
  }

  async createRole(insertRole: InsertRole): Promise<Role> {
    const roleWithId = {
      ...insertRole,
      id: crypto.randomUUID()
    };
    const [role] = await db
      .insert(roles)
      .values(roleWithId)
      .returning();
    return role;
  }

  async updateRole(id: string, updateData: Partial<InsertRole>): Promise<Role | undefined> {
    const [role] = await db
      .update(roles)
      .set(updateData)
      .where(eq(roles.id, id))
      .returning();
    return role || undefined;
  }

  async deleteRole(id: string): Promise<boolean> {
    const result = await db.delete(roles).where(eq(roles.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAllRoles(): Promise<Role[]> {
    return await db.select().from(roles);
  }

  // User-Role operations
  async assignRoleToUser(userId: string, roleId: string): Promise<boolean> {
    try {
      await db.insert(userRoles).values({ userId, roleId });
      return true;
    } catch {
      return false;
    }
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<boolean> {
    const result = await db
      .delete(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)));
    return (result.rowCount || 0) > 0;
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    const result = await db
      .select({ role: roles })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));
    return result.map(r => r.role);
  }

  // Module operations
  async getModule(id: string): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module || undefined;
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const moduleWithId = {
      ...insertModule,
      id: crypto.randomUUID()
    };
    const [module] = await db
      .insert(modules)
      .values(moduleWithId)
      .returning();
    return module;
  }

  async updateModule(id: string, updateData: Partial<InsertModule>): Promise<Module | undefined> {
    const [module] = await db
      .update(modules)
      .set(updateData)
      .where(eq(modules.id, id))
      .returning();
    return module || undefined;
  }

  async deleteModule(id: string): Promise<boolean> {
    const result = await db.delete(modules).where(eq(modules.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAllModules(): Promise<Module[]> {
    return await db.select().from(modules);
  }

  // Document operations
  async getDocument(id: string): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document || undefined;
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const documentWithId = {
      ...insertDocument,
      id: crypto.randomUUID()
    };
    const [document] = await db
      .insert(documents)
      .values(documentWithId)
      .returning();
    return document;
  }

  async updateDocument(id: string, updateData: Partial<InsertDocument>): Promise<Document | undefined> {
    const [document] = await db
      .update(documents)
      .set(updateData)
      .where(eq(documents.id, id))
      .returning();
    return document || undefined;
  }

  async deleteDocument(id: string): Promise<boolean> {
    const result = await db.delete(documents).where(eq(documents.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAllDocuments(): Promise<Document[]> {
    return await db.select().from(documents);
  }

  // Permission operations
  async getPermission(id: string): Promise<Permission | undefined> {
    const [permission] = await db.select().from(permissions).where(eq(permissions.id, id));
    return permission || undefined;
  }

  async createPermission(insertPermission: InsertPermission): Promise<Permission> {
    const permissionWithId = {
      ...insertPermission,
      id: crypto.randomUUID()
    };
    const [permission] = await db
      .insert(permissions)
      .values(permissionWithId)
      .returning();
    return permission;
  }

  async updatePermission(id: string, updateData: Partial<InsertPermission>): Promise<Permission | undefined> {
    const [permission] = await db
      .update(permissions)
      .set(updateData)
      .where(eq(permissions.id, id))
      .returning();
    return permission || undefined;
  }

  async deletePermission(id: string): Promise<boolean> {
    const result = await db.delete(permissions).where(eq(permissions.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAllPermissions(): Promise<any[]> {
    const results = await db
      .select({
        id: permissions.id,
        userId: permissions.userId,
        roleId: permissions.roleId,
        documentId: permissions.documentId,
        canAdd: permissions.canAdd,
        canModify: permissions.canModify,
        canDelete: permissions.canDelete,
        canQuery: permissions.canQuery,
        userName: users.username,
        roleName: roles.name,
        documentName: documents.name,
        documentPath: documents.path,
      })
      .from(permissions)
      .leftJoin(users, eq(permissions.userId, users.id))
      .leftJoin(roles, eq(permissions.roleId, roles.id))
      .innerJoin(documents, eq(permissions.documentId, documents.id));
    
    return results.map(r => ({
      id: r.id,
      userId: r.userId || null,
      roleId: r.roleId || null,
      documentId: r.documentId,
      canAdd: r.canAdd,
      canModify: r.canModify,
      canDelete: r.canDelete,
      canQuery: r.canQuery,
      userName: r.userName || undefined,
      roleName: r.roleName || undefined,
      documentName: r.documentName,
      documentPath: r.documentPath,
    }));
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    return await db.select().from(permissions).where(eq(permissions.userId, userId));
  }

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    return await db.select().from(permissions).where(eq(permissions.roleId, roleId));
  }

  // Module-Document operations
  async assignModuleDocument(moduleId: string, documentId: string): Promise<boolean> {
    try {
      await db.insert(moduleDocuments).values({ moduleId, documentId });
      return true;
    } catch {
      return false;
    }
  }

  async removeModuleDocument(moduleId: string, documentId: string): Promise<boolean> {
    const result = await db
      .delete(moduleDocuments)
      .where(and(eq(moduleDocuments.moduleId, moduleId), eq(moduleDocuments.documentId, documentId)));
    return (result.rowCount || 0) > 0;
  }

  async getModuleDocuments(moduleId: string): Promise<string[]> {
    const results = await db
      .select({ documentId: moduleDocuments.documentId })
      .from(moduleDocuments)
      .where(eq(moduleDocuments.moduleId, moduleId));
    return results.map(r => r.documentId);
  }
}

export const storage = new DatabaseStorage();
