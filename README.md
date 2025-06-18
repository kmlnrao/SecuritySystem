# Hospital Management Authentication System

A comprehensive Hospital Management Authentication System with advanced microservices architecture, focusing on robust user management and operational security through dynamic, configurable interfaces.

## Features

- **Role-Based Access Control (RBAC)**: Comprehensive permission system with user and role-based permissions
- **Dynamic Navigation**: Database-driven sidebar navigation with module-document hierarchy
- **User Management**: Complete CRUD operations with profile management and password controls
- **Master Tables**: Dynamic table configuration system for flexible data management
- **Comprehensive Audit Logging**: Full audit trails with user tracking, IP addresses, and change history
- **Microservices Architecture**: Optional scalable service-oriented architecture
- **Modern Tech Stack**: React + Express.js + PostgreSQL + Drizzle ORM

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS with shadcn/ui components
- TanStack Query for state management
- Wouter for routing

### Backend
- Express.js with TypeScript
- Drizzle ORM with PostgreSQL
- JWT authentication with session management
- bcrypt for password security

### Database
- PostgreSQL with comprehensive schema
- Audit logging with foreign key relationships
- Session storage and user management

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+

### Installation

1. Clone the repository
```bash
git clone https://github.com/kmlnrao/SecuritySystem.git
cd SecuritySystem
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Set up database
```bash
# Create database
createdb hospital_management

# Restore from backup
psql hospital_management < database_backup.sql
```

5. Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Docker Deployment

```bash
docker-compose up -d
```

## Database Schema

- **Users**: User accounts with credentials and status
- **Roles**: Role definitions for RBAC
- **Modules**: System modules for organization
- **Documents**: Individual pages within modules
- **Permissions**: Granular permissions (Add/Modify/Delete/Query)
- **Master Tables**: Dynamic table configurations
- **Audit Logs**: Complete operation history with user tracking

## Key Features

### Audit Logging
- Complete audit trails for all CRUD operations
- User identification and IP address tracking
- Before/after value comparison
- Audit log viewers in management interfaces

### Dynamic Navigation
- Database-driven sidebar navigation
- Permission-based menu rendering
- Module-document hierarchical structure

### Permission System
- Four permission types: Add, Modify, Delete, Query
- User-specific and role-based permissions
- Permission inheritance system

## API Endpoints

- `/api/health` - Health check
- `/api/users` - User management
- `/api/roles` - Role management
- `/api/modules` - Module management
- `/api/documents` - Document management
- `/api/permissions` - Permission management
- `/api/master-tables` - Dynamic table management
- `/api/audit-logs` - Audit log retrieval

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.