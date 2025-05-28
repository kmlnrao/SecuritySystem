const { spawn } = require('child_process');
const path = require('path');

class ServiceOrchestrator {
  constructor() {
    this.services = [];
    this.isShuttingDown = false;
  }

  startService(serviceName, scriptPath, port) {
    console.log(`🚀 Starting ${serviceName} on port ${port}...`);
    
    const service = spawn('node', [scriptPath], {
      stdio: 'pipe',
      env: { 
        ...process.env, 
        [`${serviceName.toUpperCase().replace('-', '_')}_PORT`]: port 
      }
    });

    service.stdout.on('data', (data) => {
      console.log(`[${serviceName}] ${data.toString().trim()}`);
    });

    service.stderr.on('data', (data) => {
      console.error(`[${serviceName}] ERROR: ${data.toString().trim()}`);
    });

    service.on('close', (code) => {
      if (!this.isShuttingDown) {
        console.log(`[${serviceName}] Process exited with code ${code}`);
        if (code !== 0) {
          console.log(`[${serviceName}] Restarting in 5 seconds...`);
          setTimeout(() => {
            this.startService(serviceName, scriptPath, port);
          }, 5000);
        }
      }
    });

    this.services.push({ name: serviceName, process: service, port });
    return service;
  }

  async startAllServices() {
    console.log('🏥 Hospital Management System - Microservices Architecture');
    console.log('='.repeat(60));

    // Start all microservices
    const services = [
      { name: 'auth-service', script: 'services/auth-service.js', port: 3001 },
      { name: 'user-service', script: 'services/user-service.js', port: 3002 },
      { name: 'doc-service', script: 'services/doc-service.js', port: 3003 },
      { name: 'perm-service', script: 'services/perm-service.js', port: 3004 }
    ];

    for (const service of services) {
      this.startService(service.name, service.script, service.port);
      // Small delay between service starts
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('='.repeat(60));
    console.log('✅ All microservices started successfully!');
    console.log('📊 Service Status:');
    this.services.forEach(service => {
      console.log(`   • ${service.name}: http://localhost:${service.port}`);
    });
    console.log('='.repeat(60));
  }

  async checkServiceHealth() {
    for (const service of this.services) {
      try {
        const response = await fetch(`http://localhost:${service.port}/health`);
        const health = await response.json();
        console.log(`✅ ${service.name}: ${health.status}`);
      } catch (error) {
        console.log(`❌ ${service.name}: unhealthy`);
      }
    }
  }

  shutdown() {
    console.log('\n🛑 Shutting down all services...');
    this.isShuttingDown = true;
    
    this.services.forEach(service => {
      console.log(`   Stopping ${service.name}...`);
      service.process.kill('SIGTERM');
    });

    setTimeout(() => {
      this.services.forEach(service => {
        if (!service.process.killed) {
          console.log(`   Force killing ${service.name}...`);
          service.process.kill('SIGKILL');
        }
      });
      process.exit(0);
    }, 5000);
  }
}

// Handle graceful shutdown
const orchestrator = new ServiceOrchestrator();

process.on('SIGINT', () => orchestrator.shutdown());
process.on('SIGTERM', () => orchestrator.shutdown());

// Start all services if this file is run directly
if (require.main === module) {
  orchestrator.startAllServices().catch(console.error);
}

module.exports = ServiceOrchestrator;