import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { modules, documents, moduleDocuments } from '../shared/schema.js';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { modules, documents, moduleDocuments } });

async function setupSecurityModule() {
  try {
    console.log('Setting up Security module...');

    // Create Security module
    const [securityModule] = await db
      .insert(modules)
      .values({
        name: 'Security',
        description: 'User access control and security management',
        isActive: true,
      })
      .returning();

    console.log('Created Security module:', securityModule.id);

    // Create documents under Security module
    const securityDocuments = [
      {
        name: 'User Management',
        path: '/users',
        isActive: true,
      },
      {
        name: 'Role Management', 
        path: '/roles',
        isActive: true,
      },
      {
        name: 'Module Management',
        path: '/modules', 
        isActive: true,
      },
      {
        name: 'Document Management',
        path: '/documents',
        isActive: true,
      }
    ];

    const createdDocuments = await db
      .insert(documents)
      .values(securityDocuments)
      .returning();

    console.log('Created documents:', createdDocuments.length);

    // Link documents to Security module
    const moduleDocumentMappings = createdDocuments.map(doc => ({
      moduleId: securityModule.id,
      documentId: doc.id,
    }));

    await db
      .insert(moduleDocuments)
      .values(moduleDocumentMappings);

    console.log('Linked documents to Security module');
    console.log('Security module setup completed successfully!');

  } catch (error) {
    console.error('Error setting up Security module:', error);
  } finally {
    await pool.end();
  }
}

setupSecurityModule();