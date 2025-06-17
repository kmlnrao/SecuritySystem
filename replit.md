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
- **Comprehensive Audit Logging System** (June 17, 2025): Implemented complete audit logging for all master table operations including:
  - User tracking (user ID and username) for all CREATE/UPDATE/DELETE operations
  - IP address logging for security and compliance tracking
  - User agent capture for detailed request tracking
  - Old values vs new values comparison for complete change history
  - Dedicated audit_logs table with foreign key relationships
  - API endpoints for viewing audit logs with filtering capabilities
  - Client-side audit log viewer component with detailed change visualization

## Changelog
- June 17, 2025. Initial setup with comprehensive audit logging implementation

## User Preferences
Preferred communication style: Simple, everyday language.