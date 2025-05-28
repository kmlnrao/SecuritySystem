const express = require('express');
const cors = require('cors');
const { storage } = require('../server/storage');

const app = express();
const PORT = process.env.DOC_SERVICE_PORT || 3003;

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
}));
app.use(express.json());

// Module CRUD endpoints
app.get('/modules', async (req, res) => {
  try {
    const modules = await storage.getAllModules();
    res.json(modules);
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({ message: 'Failed to fetch modules' });
  }
});

app.post('/modules', async (req, res) => {
  try {
    const module = await storage.createModule(req.body);
    res.status(201).json(module);
  } catch (error) {
    console.error('Create module error:', error);
    res.status(500).json({ message: 'Failed to create module' });
  }
});

app.put('/modules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const module = await storage.updateModule(id, req.body);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.json(module);
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({ message: 'Failed to update module' });
  }
});

app.delete('/modules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteModule(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({ message: 'Failed to delete module' });
  }
});

// Document CRUD endpoints
app.get('/documents', async (req, res) => {
  try {
    const documents = await storage.getAllDocuments();
    res.json(documents);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
});

app.post('/documents', async (req, res) => {
  try {
    const document = await storage.createDocument(req.body);
    res.status(201).json(document);
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ message: 'Failed to create document' });
  }
});

app.put('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const document = await storage.updateDocument(id, req.body);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ message: 'Failed to update document' });
  }
});

app.delete('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteDocument(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Failed to delete document' });
  }
});

// Module-Document mapping endpoints
app.post('/module-documents', async (req, res) => {
  try {
    const { moduleId, documentId } = req.body;
    const assigned = await storage.assignModuleDocument(moduleId, documentId);
    if (!assigned) {
      return res.status(400).json({ message: 'Failed to assign document to module' });
    }
    res.status(201).json({ message: 'Document assigned to module successfully' });
  } catch (error) {
    console.error('Assign module document error:', error);
    res.status(500).json({ message: 'Failed to assign document to module' });
  }
});

app.delete('/module-documents', async (req, res) => {
  try {
    const { moduleId, documentId } = req.body;
    const removed = await storage.removeModuleDocument(moduleId, documentId);
    if (!removed) {
      return res.status(404).json({ message: 'Module-document assignment not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Remove module document error:', error);
    res.status(500).json({ message: 'Failed to remove module-document assignment' });
  }
});

app.get('/module-documents/:moduleId', async (req, res) => {
  try {
    const { moduleId } = req.params;
    
    // Get all documents for a specific module
    const moduleDocuments = await storage.db.select({
      document: storage.documents
    })
    .from(storage.moduleDocuments)
    .innerJoin(storage.documents, storage.eq(storage.moduleDocuments.documentId, storage.documents.id))
    .where(storage.eq(storage.moduleDocuments.moduleId, moduleId));

    const documents = moduleDocuments.map(md => md.document);
    res.json(documents);
  } catch (error) {
    console.error('Get module documents error:', error);
    res.status(500).json({ message: 'Failed to fetch module documents' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'doc-service', status: 'healthy', port: PORT });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`📦 Doc Service running on port ${PORT}`);
  });
}

module.exports = app;