# Hospital Management Authentication System - Replit Documentation

## Overview
This is a comprehensive Hospital Management Authentication System built with a modern full-stack architecture. The application provides role-based access control, dynamic navigation, and robust user management capabilities for hospital operations. It features both monolithic API server architecture and optional microservices architecture for scalability.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Authentication**: JWT-based authentication with session management
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Alternative**: Prisma client support (dual ORM setup)
- **Password Hashing**: bcrypt for secure password storage
- **API Design**: RESTful APIs with comprehensive CRUD operations

### Database Schema
The system uses PostgreSQL with the following core entities:
- **Users**: User accounts with credentials and status
- **Roles**: Role definitions for RBAC
- **User Roles**: Many-to-many relationship between users and roles
- **Modules**: System modules for organization
- **Documents**: Individual documents/pages within modules
- **Module Documents**: Relationship mapping modules to documents
- **Permissions**: Granular permissions (Add/Modify/Delete/Query) for users and roles on documents
- **Master Tables**: Dynamic table configuration system
- **Master Data Records**: Data records for dynamic tables

## Key Components

### Authentication System
- JWT token-based authentication
- Session storage in PostgreSQL
- Protected routes with automatic redirect
- Password encryption using bcrypt/scrypt
- Role-based access control implementation

### User Management
- Complete CRUD operations for users
- Role assignment and management
- User profile management with password change
- Email and username validation
- Active/inactive user status management

### Dynamic Navigation System
- Database-driven sidebar navigation
- Module-document hierarchical structure
- Permission-based navigation rendering
- Display order control for navigation items

### Permission Management
- Document-level permission control
- Four permission types: Add, Modify, Delete, Query
- User-specific and role-based permissions
- Permission inheritance system

### Master Tables System
- Dynamic table configuration
- Runtime table creation and management
- Flexible column definitions with various data types
- CRUD operations on dynamic data

## Data Flow

### Authentication Flow
1. User submits credentials via login form
2. Server validates credentials against database
3. JWT token generated and returned to client
4. Token stored in localStorage for subsequent requests
5. Protected routes validate token on each request
6. Automatic logout on token expiration

### Navigation Flow
1. User authentication triggers navigation data fetch
2. System queries user permissions and role assignments
3. Dynamic navigation menu built based on permissions
4. Module-document relationships determine menu structure
5. Only accessible documents shown in navigation

### Permission Validation Flow
1. User attempts to access a document/feature
2. System checks user-specific permissions first
3. If no user permissions, checks role-based permissions
4. Access granted/denied based on permission evaluation
5. UI elements dynamically shown/hidden based on permissions

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Database ORM and query builder
- **@prisma/client**: Alternative ORM support
- **jsonwebtoken**: JWT token generation and validation
- **bcrypt/bcryptjs**: Password hashing
- **express**: Node.js web framework
- **react & react-dom**: Frontend framework
- **@tanstack/react-query**: Server state management

### UI Dependencies
- **@radix-ui/***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Conditional CSS classes

### Development Dependencies
- **typescript**: Type safety
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Production build bundling

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20
- **Database**: PostgreSQL 16
- **Port Configuration**: 5000 (main server)
- **Development Command**: `npm run dev`
- **Hot Reload**: Vite HMR for frontend, tsx watch for backend

### Production Build
- **Build Process**: 
  1. Frontend: Vite builds React app to `dist/public`
  2. Backend: esbuild bundles server code to `dist/index.js`
- **Start Command**: `npm run start`
- **Database Migrations**: Drizzle Kit for schema management
- **Environment**: Replit autoscale deployment

### Microservices Architecture (Optional)
The system includes an optional microservices setup:
- **Auth Service** (Port 3001): Authentication and JWT management
- **User Service** (Port 3002): User and role management
- **Doc Service** (Port 3003): Module and document management
- **Perm Service** (Port 3004): Permission management
- **Service Orchestrator** (Port 3005): Service discovery and health monitoring

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `SESSION_SECRET`: Secret for session management
- Service-specific ports for microservices setup

## Recent Changes
- **Audit Logs Enhanced with Readable Names** (June 21, 2025): Fixed audit logs across all management screens to display meaningful names instead of raw IDs:
  - **Reference Data Integration**: Audit log viewer now fetches users, roles, documents, and modules for name resolution
  - **Readable Display**: Shows "superadmin (admin@hospital.com)" instead of raw user IDs, "Super Admin" instead of role IDs
  - **Enhanced Details**: Audit log details include both original IDs and readable names (userInfo, roleInfo, documentInfo, moduleInfo)
  - **Universal Application**: Applied to all management screens - User, Role, Module, Document, Permission, Module-Document
  - **Preserved Functionality**: Maintains all existing audit trail capabilities while improving readability

- **Dashboard Display Fixed** (June 21, 2025): Resolved empty dashboard issue affecting all user logins:
  - **Authentication Simplified**: Removed complex token validation that was blocking dashboard stats API calls
  - **Role Filtering Corrected**: Changed from restrictive role-based display to universal access for authenticated users
  - **Error Handling Added**: Implemented loading states and error messages for better user experience
  - **Statistics Restored**: Dashboard now displays all key metrics (users, roles, documents, modules, patients, appointments, tasks)

- **Permission Management Access Granted to Super Admin** (June 21, 2025): Added full permissions for Super Admin role to access Permission Management screen in Security module:
  - **Direct Permission Assignment**: Created permission entry for Super Admin role with full access (canAdd, canModify, canDelete, canQuery)
  - **Navigation Integration**: Permission Management now appears in Security module sidebar for Super Admin users
  - **Immediate Access**: Super Admin can now manage all system permissions through the dedicated interface

- **Sidebar Navigation Permission Filtering Fixed** (June 18, 2025): Resolved critical navigation filtering to properly respect user/role permissions:
  - **Any Permission Logic**: Navigation shows documents where users have at least one permission (canAdd, canModify, canDelete, OR canQuery)
  - **Cache Invalidation**: Added navigation cache invalidation to all permission create/update/delete operations
  - **Super Admin Behavior**: Super Admins only see documents that have permissions assigned to any user/role (not all mapped documents)
  - **Real-Time Updates**: Permission changes immediately update sidebar navigation without requiring page refresh
  - **Module-Document Integration**: Documents appear in navigation when mapped to modules AND have permissions assigned

- **Audit Logs Integrated into All Management Screens** (June 18, 2025): Successfully integrated comprehensive audit logging directly into the existing database-driven navigation system:
  - **User Management**: Added audit logs tab within existing User Management component showing complete user operation history
  - **Role Management**: Added audit logs tab within existing Role Management component tracking role changes
  - **Module Management**: Added audit logs tab within existing Module Management component for module operations
  - **Document Management**: Added audit logs tab within existing Document Management component for document operations
  - **Permission Management**: Added audit logs tab within existing Permission Management component for permission changes
  - **Module-Document Management**: Added audit logs tab within existing Module-Document Management component for mapping operations
  - **Integration Features**:
    - Preserved all existing database-driven navigation functionality
    - Maintained dynamic module/document mapping system
    - Added tabs interface to each management screen (Management + Audit Logs)
    - Real-time audit log viewing with proper filtering by table name
    - Complete IP tracking and user identification for all operations
    - Before/after value comparison for all data changes
    - No new modules or documents created - audit functionality embedded within existing screens

- **Local Environment Deployment Package Created** (June 18, 2025): Prepared comprehensive local deployment package including:
  - **Database Backup**: Complete PostgreSQL dump (36KB) with all tables, data, and audit logs
  - **Setup Automation**: Executable setup script with database creation and environment configuration
  - **Docker Support**: Complete containerization with PostgreSQL and application services
  - **Environment Templates**: Pre-configured environment variables and examples
  - **Health Monitoring**: Added health check endpoint for deployment verification
  - **Documentation**: Comprehensive setup guides for manual and Docker deployment options
  - **Deployment Files**: Dockerfile, docker-compose.yml, and automated setup scripts

- **Comprehensive Audit Logging System Extended to All Management Modules** (June 17, 2025): Implemented complete audit logging across the entire system including:
  - **User Management**: Full audit trail for user creation, updates, profile changes, password changes, and deletions
  - **Role Management**: Complete tracking of role creation, modifications, and deletion operations
  - **Module Management**: Audit logging for all module lifecycle operations
  - **Document Management**: Full audit trail for document creation, updates, and deletions
  - **Permission Management**: Complete tracking of permission assignments, modifications, and removals
  - **Master Table Management**: Previously implemented comprehensive audit logging
  - **System-wide Features**:
    - User tracking (user ID and username) for all CREATE/UPDATE/DELETE operations across all modules
    - IP address logging for security and compliance tracking across all operations
    - User agent capture for detailed request tracking on all management endpoints
    - Old values vs new values comparison for complete change history
    - Dedicated audit_logs table with foreign key relationships supporting all entity types
    - API endpoints for viewing audit logs with filtering capabilities by table and record
    - Client-side audit log viewer component with detailed change visualization
    - System user fallback for operations without authenticated users

## Changelog
- June 17, 2025. Initial setup with comprehensive audit logging implementation

## User Preferences
Preferred communication style: Simple, everyday language.