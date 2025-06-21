# Hospital Management Authentication System

A comprehensive Hospital Management Authentication System with advanced microservices architecture, featuring hierarchical master table management, role-based access control, and complete audit logging for healthcare operations.

## ✨ Key Features

- **Hierarchical Master Tables**: Dynamic table configuration with Country → State → City style relationships and cascading dropdowns
- **Role-Based Access Control (RBAC)**: Granular permission system with user and role-based permissions
- **Dynamic Navigation**: Database-driven sidebar navigation with module-document hierarchy
- **User Management**: Complete CRUD operations with profile management and password controls
- **Comprehensive Audit Logging**: Full audit trails with user tracking, IP addresses, and change history
- **Frontend Display Control**: Column visibility management for backend-only vs frontend-visible fields
- **Microservices Architecture**: Optional scalable service-oriented architecture
- **Modern Tech Stack**: React 18 + Express.js + PostgreSQL + Drizzle ORM

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

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+
- Git

### Option 1: Automated Setup (Recommended)
```bash
# Clone the repository
git clone https://github.com/kmlnrao/SecuritySystem.git
cd SecuritySystem

# Run automated setup script
chmod +x setup-local.sh
./setup-local.sh
```

The script will guide you through database setup, environment configuration, and application startup.

### Option 2: Docker Deployment
```bash
# Development environment with auto database restore
docker-compose up

# Production environment
docker-compose -f docker-compose.prod.yml up
```

### Option 3: Manual Setup
```bash
# 1. Clone and install
git clone https://github.com/kmlnrao/SecuritySystem.git
cd SecuritySystem
npm install

# 2. Database setup
createdb hospital_management
psql hospital_management < database_backup_20250621_132917.sql

# 3. Environment configuration
cp .env.example .env
# Edit .env with your database credentials

# 4. Start development server
npm run dev
```

**Application URL**: http://localhost:5000

### Default Login Credentials
- **Super Admin**: `superadmin` / `SuperAdmin@2024!`
- **Doctor**: `dr.smith123` / `password123`
- **Nurse**: `nurse.jane123` / `password123`

## 🗄️ Database Schema

### Core Tables
- **Users**: User accounts with credentials and status management
- **Roles**: Role definitions for RBAC with hierarchical support
- **Modules**: System modules for organizational structure
- **Documents**: Individual pages within modules with routing
- **Permissions**: Granular permissions (Add/Modify/Delete/Query) with user and role assignment
- **Master Tables**: Dynamic table configurations with hierarchical relationships
- **Master Data Records**: Actual data records for dynamic tables
- **Audit Logs**: Complete operation history with user tracking and IP addresses

### Advanced Features

#### 🔄 Hierarchical Master Tables
- **Reference Column Type**: Link tables together for hierarchical relationships
- **Dynamic Dropdowns**: Auto-populated Display Field and Value Field based on reference table selection
- **Cascading Data**: Country → State → City style data relationships
- **Frontend Control**: Configurable column visibility (frontend vs backend-only fields)
- **JSON Configuration**: Flexible storage of reference relationships and display preferences

#### 📝 Comprehensive Audit Logging
- **Complete CRUD Tracking**: All create, update, delete operations across all modules
- **User Attribution**: User ID, username, and IP address for every operation
- **Change History**: Before/after value comparison for data modifications
- **Integrated Viewers**: Audit log tabs in all management interfaces
- **Real-time Updates**: Live audit trail with readable names instead of raw IDs

#### 🧭 Dynamic Navigation System
- **Permission-Based Rendering**: Sidebar shows only documents with granted permissions
- **Module-Document Hierarchy**: Organized navigation structure
- **Cache Invalidation**: Real-time navigation updates when permissions change
- **Any Permission Logic**: Shows documents where users have at least one permission type

#### 🔐 Advanced Permission System
- **Four Permission Types**: Add, Modify, Delete, Query with granular control
- **Dual Assignment**: User-specific and role-based permissions
- **Permission Inheritance**: Role permissions inherited by users
- **Real-time Updates**: Immediate permission changes without page refresh

## 🔗 API Endpoints

### Authentication & Users
- `POST /api/login` - User authentication
- `POST /api/logout` - User logout
- `GET /api/user` - Current user info
- `GET /api/users` - User management
- `GET /api/users/:id/roles` - User role assignments
- `GET /api/users/:id/navigation` - User navigation menu

### Role & Permission Management
- `GET /api/roles` - Role management
- `GET /api/permissions` - Permission management
- `GET /api/documents` - Document management
- `GET /api/modules` - Module management

### Master Tables (Hierarchical)
- `GET /api/master-tables` - List all master table configurations
- `POST /api/master-tables` - Create new master table
- `PUT /api/master-tables/:id` - Update master table configuration
- `DELETE /api/master-tables/:id` - Delete master table
- `GET /api/master-tables/:id/records` - Get records for specific table
- `POST /api/master-tables/:id/records` - Create new record
- `PUT /api/master-data-records/:id` - Update existing record
- `DELETE /api/master-data-records/:id` - Delete record

### Audit & Monitoring
- `GET /api/audit-logs` - Complete audit log retrieval
- `GET /api/master-tables/:id/audit-logs` - Table-specific audit logs
- `GET /api/dashboard/stats` - System statistics
- `GET /api/health` - Application health check

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Express.js backend
│   ├── auth.ts           # Authentication logic
│   ├── routes.ts         # API route definitions
│   ├── db.ts            # Database connection
│   └── storage.ts       # Data access layer
├── shared/               # Shared TypeScript types
│   └── schema.ts        # Database schema definitions
├── scripts/             # Database and setup scripts
├── docker-compose.yml   # Development Docker setup
├── setup-local.sh      # Automated local setup script
└── database_backup_*.sql # PostgreSQL backup files
```

## 🛠️ Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run start        # Start production server
npm run db:push      # Push schema changes to database
```

## 📚 Documentation

- [Local Deployment Guide](LOCAL_DEPLOYMENT_GUIDE.md) - Complete setup instructions
- [Project Architecture](replit.md) - Technical details and recent changes
- [Docker Setup](docker-compose.yml) - Container deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern React 18 and TypeScript
- Styled with Tailwind CSS and shadcn/ui components
- Powered by Express.js and PostgreSQL
- Deployed on Replit with autoscale capabilities