import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('🌱 Seeding hospital management database...');

  try {
    // Clear existing data
    await prisma.permission.deleteMany();
    await prisma.moduleDocument.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.document.deleteMany();
    await prisma.module.deleteMany();
    await prisma.role.deleteMany();
    await prisma.user.deleteMany();

    // Create roles
    const roles = await Promise.all([
      prisma.role.create({ data: { name: 'Admin' } }),
      prisma.role.create({ data: { name: 'Doctor' } }),
      prisma.role.create({ data: { name: 'Nurse' } }),
      prisma.role.create({ data: { name: 'Staff' } }),
      prisma.role.create({ data: { name: 'Reception' } })
    ]);

    console.log('✅ Created roles');

    // Create users with hashed passwords
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await Promise.all([
      prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@hospital.com',
          password: hashedPassword,
          isActive: true
        }
      }),
      prisma.user.create({
        data: {
          username: 'dr.smith',
          email: 'dr.smith@hospital.com',
          password: hashedPassword,
          isActive: true
        }
      }),
      prisma.user.create({
        data: {
          username: 'nurse.jane',
          email: 'nurse.jane@hospital.com',
          password: hashedPassword,
          isActive: true
        }
      }),
      prisma.user.create({
        data: {
          username: 'staff.john',
          email: 'staff.john@hospital.com',
          password: hashedPassword,
          isActive: true
        }
      }),
      prisma.user.create({
        data: {
          username: 'reception.mary',
          email: 'reception.mary@hospital.com',
          password: hashedPassword,
          isActive: true
        }
      })
    ]);

    console.log('✅ Created users');

    // Assign roles to users
    await Promise.all([
      prisma.userRole.create({ data: { userId: users[0].id, roleId: roles[0].id } }), // admin -> Admin
      prisma.userRole.create({ data: { userId: users[1].id, roleId: roles[1].id } }), // dr.smith -> Doctor
      prisma.userRole.create({ data: { userId: users[2].id, roleId: roles[2].id } }), // nurse.jane -> Nurse
      prisma.userRole.create({ data: { userId: users[3].id, roleId: roles[3].id } }), // staff.john -> Staff
      prisma.userRole.create({ data: { userId: users[4].id, roleId: roles[4].id } })  // reception.mary -> Reception
    ]);

    console.log('✅ Assigned user roles');

    // Create modules
    const modules = await Promise.all([
      prisma.module.create({ data: { name: 'Patient Management' } }),
      prisma.module.create({ data: { name: 'Medical Records' } }),
      prisma.module.create({ data: { name: 'Appointments' } }),
      prisma.module.create({ data: { name: 'Pharmacy' } }),
      prisma.module.create({ data: { name: 'Laboratory' } }),
      prisma.module.create({ data: { name: 'Administration' } })
    ]);

    console.log('✅ Created modules');

    // Create documents
    const documents = await Promise.all([
      // Patient Management
      prisma.document.create({ data: { name: 'Patient Registration', path: '/patients/register' } }),
      prisma.document.create({ data: { name: 'Patient List', path: '/patients/list' } }),
      prisma.document.create({ data: { name: 'Patient Details', path: '/patients/details' } }),
      
      // Medical Records
      prisma.document.create({ data: { name: 'Medical History', path: '/records/history' } }),
      prisma.document.create({ data: { name: 'Prescriptions', path: '/records/prescriptions' } }),
      prisma.document.create({ data: { name: 'Test Results', path: '/records/tests' } }),
      
      // Appointments
      prisma.document.create({ data: { name: 'Schedule Appointment', path: '/appointments/schedule' } }),
      prisma.document.create({ data: { name: 'View Appointments', path: '/appointments/view' } }),
      prisma.document.create({ data: { name: 'Appointment History', path: '/appointments/history' } }),
      
      // Pharmacy
      prisma.document.create({ data: { name: 'Medicine Inventory', path: '/pharmacy/inventory' } }),
      prisma.document.create({ data: { name: 'Dispense Medicine', path: '/pharmacy/dispense' } }),
      
      // Laboratory
      prisma.document.create({ data: { name: 'Lab Tests', path: '/lab/tests' } }),
      prisma.document.create({ data: { name: 'Lab Reports', path: '/lab/reports' } }),
      
      // Administration
      prisma.document.create({ data: { name: 'User Management', path: '/admin/users' } }),
      prisma.document.create({ data: { name: 'Role Management', path: '/admin/roles' } }),
      prisma.document.create({ data: { name: 'System Settings', path: '/admin/settings' } })
    ]);

    console.log('✅ Created documents');

    // Map documents to modules
    const moduleDocumentMappings = [
      // Patient Management
      { moduleId: modules[0].id, documentId: documents[0].id },
      { moduleId: modules[0].id, documentId: documents[1].id },
      { moduleId: modules[0].id, documentId: documents[2].id },
      
      // Medical Records
      { moduleId: modules[1].id, documentId: documents[3].id },
      { moduleId: modules[1].id, documentId: documents[4].id },
      { moduleId: modules[1].id, documentId: documents[5].id },
      
      // Appointments
      { moduleId: modules[2].id, documentId: documents[6].id },
      { moduleId: modules[2].id, documentId: documents[7].id },
      { moduleId: modules[2].id, documentId: documents[8].id },
      
      // Pharmacy
      { moduleId: modules[3].id, documentId: documents[9].id },
      { moduleId: modules[3].id, documentId: documents[10].id },
      
      // Laboratory
      { moduleId: modules[4].id, documentId: documents[11].id },
      { moduleId: modules[4].id, documentId: documents[12].id },
      
      // Administration
      { moduleId: modules[5].id, documentId: documents[13].id },
      { moduleId: modules[5].id, documentId: documents[14].id },
      { moduleId: modules[5].id, documentId: documents[15].id }
    ];

    await Promise.all(
      moduleDocumentMappings.map(mapping => 
        prisma.moduleDocument.create({ data: mapping })
      )
    );

    console.log('✅ Mapped documents to modules');

    // Create permissions for roles
    const permissions = [
      // Admin - full access to everything
      ...documents.map(doc => ({
        roleId: roles[0].id, // Admin
        documentId: doc.id,
        canAdd: true,
        canModify: true,
        canDelete: true,
        canQuery: true
      })),
      
      // Doctor permissions
      { roleId: roles[1].id, documentId: documents[0].id, canAdd: true, canModify: true, canDelete: false, canQuery: true }, // Patient Registration
      { roleId: roles[1].id, documentId: documents[1].id, canAdd: false, canModify: false, canDelete: false, canQuery: true }, // Patient List
      { roleId: roles[1].id, documentId: documents[2].id, canAdd: false, canModify: true, canDelete: false, canQuery: true }, // Patient Details
      { roleId: roles[1].id, documentId: documents[3].id, canAdd: true, canModify: true, canDelete: false, canQuery: true }, // Medical History
      { roleId: roles[1].id, documentId: documents[4].id, canAdd: true, canModify: true, canDelete: false, canQuery: true }, // Prescriptions
      { roleId: roles[1].id, documentId: documents[5].id, canAdd: false, canModify: false, canDelete: false, canQuery: true }, // Test Results
      { roleId: roles[1].id, documentId: documents[6].id, canAdd: true, canModify: true, canDelete: true, canQuery: true }, // Schedule Appointment
      { roleId: roles[1].id, documentId: documents[7].id, canAdd: false, canModify: true, canDelete: false, canQuery: true }, // View Appointments
      { roleId: roles[1].id, documentId: documents[11].id, canAdd: true, canModify: false, canDelete: false, canQuery: true }, // Lab Tests
      { roleId: roles[1].id, documentId: documents[12].id, canAdd: false, canModify: false, canDelete: false, canQuery: true }, // Lab Reports
      
      // Nurse permissions
      { roleId: roles[2].id, documentId: documents[1].id, canAdd: false, canModify: false, canDelete: false, canQuery: true }, // Patient List
      { roleId: roles[2].id, documentId: documents[2].id, canAdd: false, canModify: true, canDelete: false, canQuery: true }, // Patient Details
      { roleId: roles[2].id, documentId: documents[3].id, canAdd: true, canModify: false, canDelete: false, canQuery: true }, // Medical History
      { roleId: roles[2].id, documentId: documents[7].id, canAdd: false, canModify: false, canDelete: false, canQuery: true }, // View Appointments
      { roleId: roles[2].id, documentId: documents[10].id, canAdd: false, canModify: false, canDelete: false, canQuery: true }, // Dispense Medicine
      
      // Staff permissions
      { roleId: roles[3].id, documentId: documents[1].id, canAdd: false, canModify: false, canDelete: false, canQuery: true }, // Patient List
      { roleId: roles[3].id, documentId: documents[9].id, canAdd: true, canModify: true, canDelete: false, canQuery: true }, // Medicine Inventory
      { roleId: roles[3].id, documentId: documents[10].id, canAdd: true, canModify: false, canDelete: false, canQuery: true }, // Dispense Medicine
      { roleId: roles[3].id, documentId: documents[11].id, canAdd: true, canModify: false, canDelete: false, canQuery: true }, // Lab Tests
      { roleId: roles[3].id, documentId: documents[12].id, canAdd: true, canModify: false, canDelete: false, canQuery: true }, // Lab Reports
      
      // Reception permissions
      { roleId: roles[4].id, documentId: documents[0].id, canAdd: true, canModify: true, canDelete: false, canQuery: true }, // Patient Registration
      { roleId: roles[4].id, documentId: documents[1].id, canAdd: false, canModify: false, canDelete: false, canQuery: true }, // Patient List
      { roleId: roles[4].id, documentId: documents[6].id, canAdd: true, canModify: true, canDelete: true, canQuery: true }, // Schedule Appointment
      { roleId: roles[4].id, documentId: documents[7].id, canAdd: false, canModify: true, canDelete: false, canQuery: true }, // View Appointments
      { roleId: roles[4].id, documentId: documents[8].id, canAdd: false, canModify: false, canDelete: false, canQuery: true }  // Appointment History
    ];

    await Promise.all(
      permissions.map(permission => 
        prisma.permission.create({ data: permission })
      )
    );

    console.log('✅ Created role-based permissions');
    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Test Login Credentials:');
    console.log('   Admin: admin / password123');
    console.log('   Doctor: dr.smith / password123');
    console.log('   Nurse: nurse.jane / password123');
    console.log('   Staff: staff.john / password123');
    console.log('   Reception: reception.mary / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(console.error);
}

export default seedDatabase;