const express = require('express');
const cors = require('cors');

// Import all microservices
const authService = require('./auth-service');
const userService = require('./user-service');
const docService = require('./doc-service');
const permService = require('./perm-service');

const app = express();
const PORT = process.env.ORCHESTRATOR_PORT || 3005;

app.use(cors());
app.use(express.json());

// Service discovery endpoint
app.get('/services', (req, res) => {
  res.json({
    services: [
      { name: 'auth-service', port: process.env.AUTH_SERVICE_PORT || 3001, health: '/health' },
      { name: 'user-service', port: process.env.USER_SERVICE_PORT || 3002, health: '/health' },
      { name: 'doc-service', port: process.env.DOC_SERVICE_PORT || 3003, health: '/health' },
      { name: 'perm-service', port: process.env.PERM_SERVICE_PORT || 3004, health: '/health' }
    ],
    orchestrator: {
      name: 'service-orchestrator',
      port: PORT,
      status: 'healthy'
    }
  });
});

// Health check for all services
app.get('/health/all', async (req, res) => {
  const services = [
    { name: 'auth-service', port: process.env.AUTH_SERVICE_PORT || 3001 },
    { name: 'user-service', port: process.env.USER_SERVICE_PORT || 3002 },
    { name: 'doc-service', port: process.env.DOC_SERVICE_PORT || 3003 },
    { name: 'perm-service', port: process.env.PERM_SERVICE_PORT || 3004 }
  ];

  const healthChecks = await Promise.all(
    services.map(async (service) => {
      try {
        const response = await fetch(`http://localhost:${service.port}/health`);
        const data = await response.json();
        return { ...service, status: 'healthy', data };
      } catch (error) {
        return { ...service, status: 'unhealthy', error: error.message };
      }
    })
  );

  res.json({
    orchestrator: { status: 'healthy', port: PORT },
    services: healthChecks
  });
});

// Start all microservices
function startMicroservices() {
  const services = [
    { app: authService, port: process.env.AUTH_SERVICE_PORT || 3001, name: '🔐 Auth Service' },
    { app: userService, port: process.env.USER_SERVICE_PORT || 3002, name: '👥 User Service' },
    { app: docService, port: process.env.DOC_SERVICE_PORT || 3003, name: '📦 Doc Service' },
    { app: permService, port: process.env.PERM_SERVICE_PORT || 3004, name: '🔐 Perm Service' }
  ];

  services.forEach(({ app, port, name }) => {
    app.listen(port, () => {
      console.log(`${name} running on port ${port}`);
    });
  });
}

if (require.main === module) {
  console.log('🚀 Starting Hospital Management Microservices...');
  
  // Start orchestrator
  app.listen(PORT, () => {
    console.log(`🎯 Service Orchestrator running on port ${PORT}`);
    console.log(`📊 Service Discovery: http://localhost:${PORT}/services`);
    console.log(`💚 Health Check: http://localhost:${PORT}/health/all`);
  });

  // Start all microservices
  startMicroservices();
  
  console.log('\n✅ All Hospital Management Microservices are running!');
  console.log('\nService Endpoints:');
  console.log(`🔐 Auth Service: http://localhost:${process.env.AUTH_SERVICE_PORT || 3001}`);
  console.log(`👥 User Service: http://localhost:${process.env.USER_SERVICE_PORT || 3002}`);
  console.log(`📦 Doc Service: http://localhost:${process.env.DOC_SERVICE_PORT || 3003}`);
  console.log(`🔐 Perm Service: http://localhost:${process.env.PERM_SERVICE_PORT || 3004}`);
  console.log(`🎯 Orchestrator: http://localhost:${PORT}`);
}

module.exports = app;