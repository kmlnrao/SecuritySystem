#!/bin/bash

# Hospital Management System - Local Setup Script
echo "🏥 Setting up Hospital Management System locally..."

# Check prerequisites
check_prereqs() {
    echo "Checking prerequisites..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js not found. Please install Node.js 20+"
        exit 1
    fi
    
    if ! command -v psql &> /dev/null; then
        echo "❌ PostgreSQL not found. Please install PostgreSQL 16+"
        exit 1
    fi
    
    if ! command -v createdb &> /dev/null; then
        echo "❌ PostgreSQL tools not found. Ensure PostgreSQL is properly installed"
        exit 1
    fi
    
    echo "✅ Prerequisites check passed"
}

# Create database
setup_database() {
    echo "Setting up database..."
    
    read -p "Enter PostgreSQL username (default: $USER): " PG_USER
    PG_USER=${PG_USER:-$USER}
    
    read -s -p "Enter PostgreSQL password: " PG_PASSWORD
    echo
    
    DB_NAME="hospital_management"
    
    # Create database
    echo "Creating database: $DB_NAME"
    createdb -U $PG_USER $DB_NAME 2>/dev/null || echo "Database might already exist"
    
    # Restore from backup
    if [ -f "database_backup.sql" ]; then
        echo "Restoring database from backup..."
        PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -d $DB_NAME -f database_backup.sql > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo "✅ Database restored successfully"
        else
            echo "❌ Database restore failed. Check your credentials and try again"
            exit 1
        fi
    else
        echo "❌ database_backup.sql not found"
        exit 1
    fi
    
    # Create .env file
    echo "Creating .env file..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://$PG_USER:$PG_PASSWORD@localhost:5432/$DB_NAME
PGHOST=localhost
PGPORT=5432
PGUSER=$PG_USER
PGPASSWORD=$PG_PASSWORD
PGDATABASE=$DB_NAME

# Authentication Secrets
JWT_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)

# Server Configuration
NODE_ENV=development
PORT=5000
EOF
    
    echo "✅ Environment configuration created"
}

# Install dependencies
install_deps() {
    echo "Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed successfully"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
}

# Main setup process
main() {
    check_prereqs
    setup_database
    install_deps
    
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "To start the application:"
    echo "  npm run dev"
    echo ""
    echo "The application will be available at: http://localhost:5000"
    echo ""
    echo "Default admin credentials are in your database backup."
    echo "Check LOCAL_SETUP.md for more details."
}

main