import { pgTable, text, serial, boolean, uuid, timestamp, foreignKey, integer, varchar, json } from "drizzle-orm/pg-core";
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
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
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
  description: text("description"),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  path: text("path").notNull(),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
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

// Master Table Configuration
export const masterTableConfigs = pgTable("master_table_configs", {
  id: uuid("id").primaryKey().defaultRandom(),
  tableName: text("table_name").notNull().unique(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  columns: text("columns").notNull(), // JSON string of column definitions
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Master Data Tables (dynamic structure)
export const masterDataRecords = pgTable("master_data_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  tableId: uuid("table_id").notNull(),
  recordData: text("record_data").notNull(), // JSON string with dynamic fields
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  tableIdFk: foreignKey({
    columns: [table.tableId],
    foreignColumns: [masterTableConfigs.id],
  }),
}));

// Audit Log Table
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  tableName: text("table_name").notNull(), // master_table_configs, master_data_records, etc.
  recordId: text("record_id").notNull(), // ID of the affected record
  operation: text("operation").notNull(), // CREATE, UPDATE, DELETE
  operationType: text("operation_type").notNull(), // MASTER_TABLE_CONFIG, MASTER_DATA_RECORD
  oldValues: text("old_values"), // JSON string of previous values (for UPDATE/DELETE)
  newValues: text("new_values"), // JSON string of new values (for CREATE/UPDATE)
  userId: text("user_id").notNull(),
  username: text("username").notNull(),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
}, (table) => ({
  userIdFk: foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
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

export const masterTableConfigsRelations = relations(masterTableConfigs, ({ many }) => ({
  records: many(masterDataRecords),
}));

export const masterDataRecordsRelations = relations(masterDataRecords, ({ one }) => ({
  config: one(masterTableConfigs, {
    fields: [masterDataRecords.tableId],
    references: [masterTableConfigs.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertRoleSchema = createInsertSchema(roles).omit({
  id: true,
  createdAt: true,
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

export const insertPermissionSchema = createInsertSchema(permissions).omit({
  id: true,
});

export const insertMasterTableConfigSchema = createInsertSchema(masterTableConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMasterDataRecordSchema = createInsertSchema(masterDataRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
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
export type MasterTableConfig = typeof masterTableConfigs.$inferSelect;
export type InsertMasterTableConfig = z.infer<typeof insertMasterTableConfigSchema>;
export type MasterDataRecord = typeof masterDataRecords.$inferSelect;
export type InsertMasterDataRecord = z.infer<typeof insertMasterDataRecordSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
