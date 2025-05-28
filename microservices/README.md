# Hospital Management Microservices Architecture

## 🏗️ Service Architecture

### 1. 🔐 Auth Service (Port 3001)
**Responsibility:** Authentication & JWT Management
- `POST /login` - User authentication
- `GET /verify-token` - Token validation

### 2. 👥 User Service (Port 3002)
**Responsibility:** User & Role Management
- `GET /users`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`
- `GET /roles`, `POST /roles`, `PUT /roles/:id`, `DELETE /roles/:id`
- `POST /user-roles`, `DELETE /user-roles`, `GET /users/:userId/roles`

### 3. 📦 Doc Service (Port 3003)
**Responsibility:** Module & Document Management
- `GET /modules`, `POST /modules`, `PUT /modules/:id`, `DELETE /modules/:id`
- `GET /documents`, `POST /documents`, `PUT /documents/:id`, `DELETE /documents/:id`
- `POST /module-documents`, `DELETE /module-documents`, `GET /module-documents/:moduleId`

### 4. 🔐 Perm Service (Port 3004)
**Responsibility:** Permission Management
- `POST /permissions/user` - Assign permissions to user
- `POST /permissions/role` - Assign permissions to role
- `GET /permissions/user/:userId` - Get user permissions
- `GET /user/navigation/:userId` - Get dynamic navigation menu

### 5. 🎯 Service Orchestrator (Port 3005)
**Responsibility:** Service Discovery & Health Monitoring
- `GET /services` - Service discovery
- `GET /health/all` - Health check all services

## 🚀 How to Run

### Option 1: Start All Services
```bash
node microservices/service-orchestrator.js
```

### Option 2: Start Individual Services
```bash
node microservices/auth-service.js
node microservices/user-service.js
node microservices/doc-service.js
node microservices/perm-service.js
```

## 📋 Database Schema (Prisma)

The `shared/schema.prisma` file contains:
- Users, Roles, UserRoles
- Modules, Documents, ModuleDocuments
- Permissions (role-based and user-specific)

## 🌐 API Endpoints Summary

| Service | Port | Key Endpoints |
|---------|------|---------------|
| Auth | 3001 | `/login`, `/verify-token` |
| User | 3002 | `/users`, `/roles`, `/user-roles` |
| Doc | 3003 | `/modules`, `/documents`, `/module-documents` |
| Perm | 3004 | `/permissions/*`, `/user/navigation/:userId` |
| Orchestrator | 3005 | `/services`, `/health/all` |

## 🔧 Environment Variables

Create `.env` file with:
```
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret
AUTH_SERVICE_PORT=3001
USER_SERVICE_PORT=3002
DOC_SERVICE_PORT=3003
PERM_SERVICE_PORT=3004
ORCHESTRATOR_PORT=3005
```