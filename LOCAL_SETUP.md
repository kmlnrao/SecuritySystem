# Local Environment Setup Guide

## Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Git

## Database Setup

### 1. Create Local Database
```bash
# Create database
createdb hospital_management

# Restore from backup
psql hospital_management < database_backup.sql
```

### 2. Environment Variables
Create `.env` file in root directory:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/hospital_management
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=hospital_management

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-super-secret-session-key-here

# Development
NODE_ENV=development
PORT=5000
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Migration (if needed)
```bash
npm run db:push
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Default Admin Account
- Username: `superadmin`
- Password: Check your database backup for encrypted password

## Features Available
- ✅ User Management with RBAC
- ✅ Role Management
- ✅ Module & Document Management
- ✅ Permission Management
- ✅ Master Tables (Dynamic Tables)
- ✅ Comprehensive Audit Logging
- ✅ Dynamic Navigation System

## Database Schema
The backup includes:
- Users, Roles, User Roles
- Modules, Documents, Module Documents
- Permissions (User & Role based)
- Master Table Configurations
- Master Data Records
- Comprehensive Audit Logs
- Session storage

## Troubleshooting
1. **Database connection issues**: Verify PostgreSQL is running and credentials in `.env`
2. **Permission errors**: Ensure database user has CREATE/ALTER privileges
3. **Port conflicts**: Change PORT in `.env` if 5000 is occupied