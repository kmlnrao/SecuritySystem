# Hospital Management System - Local Deployment Package

## Package Contents

### Core Files
- `database_backup.sql` (36KB) - Complete PostgreSQL database dump with all data
- `LOCAL_SETUP.md` - Detailed setup instructions
- `.env.example` - Environment variables template
- `setup-local.sh` - Automated setup script (executable)

### Docker Deployment (Optional)
- `Dockerfile` - Container configuration
- `docker-compose.yml` - Multi-service orchestration with PostgreSQL

### Application Files
- Complete Node.js application with React frontend
- Express.js backend with microservices support
- Comprehensive audit logging system
- Role-based access control (RBAC)

## Quick Start Options

### Option 1: Manual Setup
1. Install PostgreSQL 16+ and Node.js 20+
2. Run: `./setup-local.sh`
3. Follow prompts for database credentials
4. Start: `npm run dev`

### Option 2: Docker Setup
1. Install Docker and Docker Compose
2. Run: `docker-compose up -d`
3. Access: `http://localhost:5000`

## Database Contents
- **Users**: 7 users including superadmin
- **Roles**: 7 roles with hierarchical permissions
- **Modules**: System modules for organization
- **Documents**: Individual pages within modules
- **Permissions**: Granular RBAC controls
- **Master Tables**: 1 configured dynamic table
- **Audit Logs**: Complete operation history
- **Session Data**: Authentication sessions

## Key Features
- Dynamic sidebar navigation
- User and role management
- Permission-based access control
- Master table configurations
- Comprehensive audit trails
- IP address and user agent logging
- Real-time session management

## Default Credentials
Check the `users` table in your restored database for encrypted passwords.
Superadmin account is pre-configured for system access.

## Support
- Health check endpoint: `/api/health`
- All API endpoints documented in codebase
- Microservices architecture available
- Session-based authentication with JWT support