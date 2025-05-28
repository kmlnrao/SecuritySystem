import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🏥 Starting Hospital Management Microservices...\n');

// Start each microservice
const services = [
  { name: 'Auth Service', script: 'services/auth-service.js', port: 3001 },
  { name: 'User Service', script: 'services/user-service.js', port: 3002 },
  { name: 'Doc Service', script: 'services/doc-service.js', port: 3003 },
  { name: 'Permission Service', script: 'services/perm-service.js', port: 3004 }
];

const processes = [];

services.forEach(service => {
  console.log(`🚀 Starting ${service.name} on port ${service.port}...`);
  
  const process = spawn('node', [service.script], {
    cwd: __dirname,
    stdio: 'inherit',
    env: { 
      ...process.env,
      PORT: service.port
    }
  });

  process.on('error', (err) => {
    console.error(`❌ Error starting ${service.name}:`, err);
  });

  processes.push({ name: service.name, process });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down microservices...');
  processes.forEach(({ name, process }) => {
    console.log(`   Stopping ${name}...`);
    process.kill('SIGTERM');
  });
  process.exit(0);
});

console.log('\n✅ All microservices started! Press Ctrl+C to stop.\n');