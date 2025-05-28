import { pgTable, text, serial, boolean, uuid, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

export const userRoles = pgTable("user_roles", {
  userId: uuid("user_id").notNull(),
  roleId: uuid("role_id").notNull(),
}, (table) => ({
  userIdFk: foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
  }),
  roleIdFk: foreignKey({
    columns: [table.roleId],
    foreignColumns: [roles.id],
  }),
}));

export const modules = pgTable("modules", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  path: text("path").notNull(),
});

export const moduleDocuments = pgTable("module_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  moduleId: uuid("module_id").notNull(),
  documentId: uuid("document_id").notNull(),
}, (table) => ({
  moduleIdFk: foreignKey({
    columns: [table.moduleId],
    foreignColumns: [modules.id],
  }),
  documentIdFk: foreignKey({
    columns: [table.documentId],
    foreignColumns: [documents.id],
  }),
}));

export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  roleId: uuid("role_id"),
  documentId: uuid("document_id").notNull(),
  canAdd: boolean("can_add").notNull().default(false),
  canModify: boolean("can_modify").notNull().default(false),
  canDelete: boolean("can_delete").notNull().default(false),
  canQuery: boolean("can_query").notNull().default(false),
}, (table) => ({
  userIdFk: foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
  }),
  roleIdFk: foreignKey({
    columns: [table.roleId],
    foreignColumns: [roles.id],
  }),
  documentIdFk: foreignKey({
    columns: [table.documentId],
    foreignColumns: [documents.id],
  }),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles),
  permissions: many(permissions),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  permissions: many(permissions),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const modulesRelations = relations(modules, ({ many }) => ({
  moduleDocuments: many(moduleDocuments),
}));

export const documentsRelations = relations(documents, ({ many }) => ({
  moduleDocuments: many(moduleDocuments),
  permissions: many(permissions),
}));

export const moduleDocumentsRelations = relations(moduleDocuments, ({ one }) => ({
  module: one(modules, {
    fields: [moduleDocuments.moduleId],
    references: [modules.id],
  }),
  document: one(documents, {
    fields: [moduleDocuments.documentId],
    references: [documents.id],
  }),
}));

export const permissionsRelations = relations(permissions, ({ one }) => ({
  user: one(users, {
    fields: [permissions.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [permissions.roleId],
    references: [roles.id],
  }),
  document: one(documents, {
    fields: [permissions.documentId],
    references: [documents.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertRoleSchema = createInsertSchema(roles).omit({
  id: true,
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
});

export const insertPermissionSchema = createInsertSchema(permissions).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Role = typeof roles.$inferSelect;
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Permission = typeof permissions.$inferSelect;
export type InsertPermission = z.infer<typeof insertPermissionSchema>;
export type UserRole = typeof userRoles.$inferSelect;
export type ModuleDocument = typeof moduleDocuments.$inferSelect;
