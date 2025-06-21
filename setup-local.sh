#!/bin/bash

# Hospital Management System - Local Setup Script
# This script automates the local deployment process

set -e  # Exit on any error

echo "🏥 Hospital Management System - Local Setup"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | sed 's/v//')
    print_status "Node.js version: $NODE_VERSION"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check PostgreSQL
    if ! command -v psql &> /dev/null; then
        print_error "PostgreSQL is not installed. Please install PostgreSQL 12+ first."
        exit 1
    fi
    
    print_status "All prerequisites met!"
}

# Database setup
setup_database() {
    print_status "Setting up database..."
    
    # Prompt for database details
    read -p "Enter PostgreSQL username [postgres]: " DB_USER
    DB_USER=${DB_USER:-postgres}
    
    read -p "Enter PostgreSQL password: " -s DB_PASSWORD
    echo
    
    read -p "Enter database name [hospital_management]: " DB_NAME
    DB_NAME=${DB_NAME:-hospital_management}
    
    read -p "Enter database host [localhost]: " DB_HOST
    DB_HOST=${DB_HOST:-localhost}
    
    read -p "Enter database port [5432]: " DB_PORT
    DB_PORT=${DB_PORT:-5432}
    
    # Test connection
    export PGPASSWORD="$DB_PASSWORD"
    if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "SELECT 1;" &> /dev/null; then
        print_error "Cannot connect to PostgreSQL. Please check your credentials."
        exit 1
    fi
    
    print_status "PostgreSQL connection successful!"
    
    # Create database if it doesn't exist
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || print_warning "Database $DB_NAME already exists"
    
    # Restore from backup
    if [ -f "database_backup_20250621_132917.sql" ]; then
        print_status "Restoring database from backup..."
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" < database_backup_20250621_132917.sql
        print_status "Database restored successfully!"
    else
        print_warning "Backup file not found. Database will be initialized with migrations."
    fi
    
    # Store database URL
    DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
}

# Environment setup
setup_environment() {
    print_status "Setting up environment variables..."
    
    # Generate JWT secret if not provided
    JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || date +%s | sha256sum | base64 | head -c 32)
    SESSION_SECRET=$(openssl rand -base64 32 2>/dev/null || date +%s | sha256sum | base64 | head -c 32)
    
    # Create .env file
    cat > .env << EOF
# Database Configuration
DATABASE_URL=$DATABASE_URL

# Application Secrets
JWT_SECRET=$JWT_SECRET
SESSION_SECRET=$SESSION_SECRET

# Environment
NODE_ENV=development
PORT=5000

# Database Connection Details (for reference)
PGUSER=$DB_USER
PGPASSWORD=$DB_PASSWORD
PGDATABASE=$DB_NAME
PGHOST=$DB_HOST
PGPORT=$DB_PORT
EOF
    
    print_status "Environment file created!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    print_status "Dependencies installed!"
}

# Run migrations if needed
run_migrations() {
    if [ ! -f "database_backup_20250621_132917.sql" ]; then
        print_status "Running database migrations..."
        npm run db:push || print_warning "Migration failed - will try to start anyway"
    fi
}

# Start application
start_application() {
    print_status "Starting application..."
    
    echo
    echo "🎉 Setup completed successfully!"
    echo "================================"
    echo "Database: $DB_NAME"
    echo "Application URL: http://localhost:5000"
    echo
    echo "Default login credentials:"
    echo "- Super Admin: superadmin / SuperAdmin@2024!"
    echo "- Doctor: dr.smith123 / password123"
    echo "- Nurse: nurse.jane123 / password123"
    echo
    print_status "Starting development server..."
    
    npm run dev
}

# Main execution
main() {
    check_prerequisites
    setup_database
    setup_environment
    install_dependencies
    run_migrations
    start_application
}

# Handle interruption
trap 'print_error "Setup interrupted by user"; exit 1' INT

# Run main function
main