import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createSuperAdmin() {
  console.log('🔐 Creating Super Admin user with full permissions...\n');

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
    } else {
      console.log('ℹ️  Super Admin role already exists');
    }

    // Check if super admin user exists
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { 
        OR: [
          { username: 'superadmin' },
          { email: 'superadmin@hospital.com' }
        ]
      },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    let superAdminUser;
    
    if (existingSuperAdmin) {
      console.log('ℹ️  Super Admin user already exists');
      superAdminUser = existingSuperAdmin;
      
      // Ensure user has Super Admin role
      const hasRole = existingSuperAdmin.userRoles.some(ur => ur.role.name === 'Super Admin');
      if (!hasRole) {
        await prisma.userRole.create({
          data: {
            userId: existingSuperAdmin.id,
            roleId: superAdminRole.id
          }
        });
        console.log('✅ Added Super Admin role to existing user');
      }
    } else {
      // Create super admin user with strong password
      const hashedPassword = await bcrypt.hash('SuperAdmin@2024!', 12);
      superAdminUser = await prisma.user.create({
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

      console.log('✅ Assigned Super Admin role to user');
    }

    // Get all documents in the system
    const allDocuments = await prisma.document.findMany({
      orderBy: { name: 'asc' }
    });

    if (allDocuments.length === 0) {
      console.log('⚠️  No documents found in system. Please run database seeding first.');
      return;
    }

    // Delete existing permissions for Super Admin role to avoid duplicates
    const deletedCount = await prisma.permission.deleteMany({
      where: { roleId: superAdminRole.id }
    });

    if (deletedCount.count > 0) {
      console.log(`🗑️  Removed ${deletedCount.count} existing Super Admin permissions`);
    }

    // Create full permissions for Super Admin role on all documents
    const superAdminPermissions = allDocuments.map(doc => ({
      roleId: superAdminRole.id,
      documentId: doc.id,
      canAdd: true,
      canModify: true,
      canDelete: true,
      canQuery: true
    }));

    await prisma.permission.createMany({
      data: superAdminPermissions
    });

    console.log(`✅ Granted full permissions to ${allDocuments.length} hospital documents`);

    // Display created permissions by module
    const modules = await prisma.module.findMany({
      include: {
        moduleDocuments: {
          include: {
            document: true
          }
        }
      }
    });

    console.log('\n📋 Super Admin Full Access Granted To:');
    modules.forEach(module => {
      console.log(`\n   📁 ${module.name}:`);
      module.moduleDocuments.forEach(md => {
        console.log(`      • ${md.document.name} (${md.document.path})`);
      });
    });

    console.log('\n🎉 Super Admin setup completed successfully!');
    console.log('\n🔑 Super Admin Login Credentials:');
    console.log('   Username: superadmin');
    console.log('   Password: SuperAdmin@2024!');
    console.log('   Email: superadmin@hospital.com');
    console.log('\n🏥 Super Admin has complete access to all hospital management modules:');
    console.log('   • Patient Management (Register, View, Update patients)');
    console.log('   • Medical Records (History, Prescriptions, Test Results)');
    console.log('   • Appointments (Schedule, View, Manage appointments)');
    console.log('   • Pharmacy (Inventory, Dispense medications)');
    console.log('   • Laboratory (Tests, Reports)');
    console.log('   • Administration (Users, Roles, System settings)');

  } catch (error) {
    console.error('❌ Error creating Super Admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createSuperAdmin().catch(console.error);