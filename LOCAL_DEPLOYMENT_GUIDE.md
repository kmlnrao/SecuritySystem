# Hospital Management System - Local Deployment Guide

## Overview
This guide will help you set up the Hospital Management Authentication System on your local development environment.

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+ 
- Git

## Quick Setup (Recommended)

### Option 1: Automated Setup Script
1. Run the setup script:
   ```bash
   chmod +x setup-local.sh
   ./setup-local.sh
   ```

### Option 2: Manual Setup

#### 1. Database Setup
```bash
# Create database
createdb hospital_management

# Restore from backup
psql hospital_management < database_backup_20250621_132917.sql
```

#### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings:
DATABASE_URL=postgresql://username:password@localhost:5432/hospital_management
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-session-secret-key-here
NODE_ENV=development
```

#### 3. Install Dependencies & Start
```bash
# Install dependencies
npm install

# Run database migrations (if needed)
npm run db:push

# Start development server
npm run dev
```

## Database Backup Information
- **File**: `database_backup_20250621_132917.sql`
- **Size**: 79KB
- **Contains**: 
  - Complete schema with all tables
  - User accounts and roles
  - Master table configurations (Country, State hierarchical setup)
  - Permission settings
  - Audit logs
  - Sample data

## Default Login Credentials
- **Super Admin**: superadmin / SuperAdmin@2024!
- **Doctor**: dr.smith123 / password123
- **Nurse**: nurse.jane123 / password123

## Application URLs
- **Frontend**: http://localhost:5000
- **API**: http://localhost:5000/api

## Features Included
- Role-based authentication system
- Dynamic sidebar navigation based on permissions
- User and role management
- Module and document management
- Permission management with granular controls
- Master table configuration with hierarchical relationships
- Audit logging with user tracking
- Dashboard with system statistics

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL service
sudo systemctl status postgresql

# Start PostgreSQL if stopped
sudo systemctl start postgresql
```

### Port Conflicts
If port 5000 is in use, modify `server/index.ts`:
```javascript
const PORT = process.env.PORT || 3000;
```

### Missing Dependencies
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database

## Architecture Notes
- Frontend: React 18 with TypeScript and Tailwind CSS
- Backend: Express.js with TypeScript
- Database: PostgreSQL with Drizzle ORM
- Authentication: JWT with session management
- UI Components: shadcn/ui with Radix primitives

## Support
For issues or questions, refer to the main README.md or check the audit logs in the application for system activity tracking.