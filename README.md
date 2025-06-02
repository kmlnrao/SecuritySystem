# Hospital Management Authentication System

A comprehensive Hospital Management Authentication System with advanced microservices architecture, focusing on robust user management and operational security.

## 🏥 Overview

This system provides a complete hospital management solution with role-based access control, dynamic navigation, and comprehensive security features. Built with modern web technologies and microservices architecture.

## ✨ Key Features

### Authentication & Security
- JWT-based authentication system
- Role-based access control (RBAC)
- Granular document-level permissions
- Session management with PostgreSQL storage
- Password encryption using bcrypt

### User Management
- Create, update, and delete users
- Role assignment and management
- User profile management with password change functionality
- Email and username validation

### Dynamic Navigation
- Database-driven sidebar navigation
- Module-document mapping system
- Display order control for navigation items
- Permission-based navigation rendering

### Dashboard System
- Role-specific dashboard widgets
- Real-time statistics and metrics
- Administrative controls for superadmin users
- Responsive design with collapsible sidebar

### Permission Management
- Document-level permission control (Add, Modify, Delete, Query)
- User and role-based permission assignment
- Module-document relationship management
- Permission inheritance system

## 🏗️ Architecture

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **TanStack Query** for data fetching
- **React Hook Form** with Zod validation
- **Wouter** for routing

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **PostgreSQL** as primary database
- **Passport.js** for authentication
- **bcrypt** for password hashing

### Database
- **PostgreSQL** with Drizzle ORM
- Structured schema with proper relations
- Session storage integration
- Migration support

## 📊 Database Schema

### Core Tables
- `users` - User account information
- `roles` - System roles definition
- `user_roles` - User-role relationships
- `modules` - System modules
- `documents` - Document/screen definitions
- `permissions` - Permission assignments
- `module_documents` - Module-document mappings

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kmlnrao/SecuritySystem.git
   cd SecuritySystem
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Configure your environment variables:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret
   ```

4. **Set up the database:**
   ```bash
   npm run db:push
   ```

5. **Seed initial data:**
   ```bash
   npm run seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 👥 Default Users

After seeding, you can login with:

**Super Admin:**
- Username: `superadmin`
- Password: `admin123`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio
- `npm run seed` - Seed database with initial data

## 📱 Features Overview

### User Roles
- **Super Admin** - Full system access
- **Admin** - Administrative privileges
- **Doctor** - Medical staff access
- **Nurse** - Nursing staff access
- **Staff** - General staff access

### Navigation System
- Collapsible sidebar with toggle functionality
- Role-based navigation items
- Permission indicators on navigation items
- Dynamic content loading within dashboard

### Profile Management
- Update profile information (username, email)
- Change password with current password verification
- Dropdown menu in header for easy access
- Form validation and error handling

## 🔒 Security Features

- Password hashing with bcrypt
- Session-based authentication
- CSRF protection
- SQL injection prevention with ORM
- Input validation and sanitization
- Role-based route protection

## 🎨 UI/UX Features

- Responsive design for all screen sizes
- Dark/light theme support
- Loading states and error handling
- Toast notifications for user feedback
- Form validation with real-time feedback

## 🏥 Hospital Modules

The system includes modules for:
- Patient Management
- Medical Records
- Appointments
- Pharmacy
- Laboratory
- Administration
- Security

## 📈 Performance

- Optimized database queries
- Efficient caching strategies
- Lazy loading for components
- Minimized bundle sizes
- Fast development workflow

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🛠️ Tech Stack

### Frontend
- React.js + TypeScript
- Tailwind CSS
- Shadcn/ui Components
- TanStack Query
- React Hook Form + Zod
- Wouter Router

### Backend
- Node.js + Express.js
- TypeScript
- Drizzle ORM
- Passport.js
- bcrypt

### Database
- PostgreSQL
- Session Storage

### Development Tools
- Vite
- ESLint
- Prettier
- TypeScript

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

## 🎯 Future Enhancements

- Real-time notifications
- Advanced reporting system
- Mobile application
- API documentation with Swagger
- Audit logging system
- Two-factor authentication
- Advanced role hierarchies