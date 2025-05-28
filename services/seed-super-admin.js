import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createSuperAdmin() {
  console.log('🔐 Creating Super Admin user...');

  try {
    // Check if Super Admin role exists, create if not
    let superAdminRole = await prisma.role.findUnique({
      where: { name: 'Super Admin' }
    });

    if (!superAdminRole) {
      superAdminRole = await prisma.role.create({
        data: { name: 'Super Admin' }
      });
      console.log('✅ Created Super Admin role');
    }

    // Check if super admin user exists
    const existingSuperAdmin = await prisma.user.findUnique({
      where: { username: 'superadmin' }
    });

    if (existingSuperAdmin) {
      console.log('ℹ️  Super Admin user already exists');
      return;
    }

    // Create super admin user
    const hashedPassword = await bcrypt.hash('SuperAdmin@2024', 12);
    const superAdminUser = await prisma.user.create({
      data: {
        username: 'superadmin',
        email: 'superadmin@hospital.com',
        password: hashedPassword,
        isActive: true
      }
    });

    console.log('✅ Created Super Admin user');

    // Assign Super Admin role to user
    await prisma.userRole.create({
      data: {
        userId: superAdminUser.id,
        roleId: superAdminRole.id
      }
    });

    console.log('✅ Assigned Super Admin role');

    // Get all documents in the system
    const allDocuments = await prisma.document.findMany();

    // Create full permissions for Super Admin role on all documents
    const superAdminPermissions = allDocuments.map(doc => ({
      roleId: superAdminRole.id,
      documentId: doc.id,
      canAdd: true,
      canModify: true,
      canDelete: true,
      canQuery: true
    }));

    // Delete existing permissions for Super Admin role to avoid duplicates
    await prisma.permission.deleteMany({
      where: { roleId: superAdminRole.id }
    });

    // Create new permissions
    await prisma.permission.createMany({
      data: superAdminPermissions
    });

    console.log(`✅ Granted full permissions to ${allDocuments.length} documents`);

    console.log('\n🎉 Super Admin setup completed successfully!');
    console.log('\n📋 Super Admin Login Credentials:');
    console.log('   Username: superadmin');
    console.log('   Password: SuperAdmin@2024');
    console.log('   Email: superadmin@hospital.com');
    console.log('\n🔒 Super Admin has full access to all hospital modules and documents.');

  } catch (error) {
    console.error('❌ Error creating Super Admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Auto-create Super Admin when auth service starts
export async function initializeSuperAdmin() {
  try {
    await createSuperAdmin();
  } catch (error) {
    console.error('Failed to initialize Super Admin:', error);
  }
}

// Run directly if this file is executed
if (import.meta.url === `file://${process.argv[1]}`) {
  createSuperAdmin().catch(console.error);
}

export default createSuperAdmin;