const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.DOC_SERVICE_PORT || 3003;

app.use(cors());
app.use(express.json());

// Modules CRUD
app.get('/modules', async (req, res) => {
  try {
    const modules = await prisma.module.findMany({
      include: {
        moduleDocuments: {
          include: {
            document: true
          }
        }
      }
    });
    res.json(modules);
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({ message: 'Failed to fetch modules' });
  }
});

app.post('/modules', async (req, res) => {
  try {
    const { name } = req.body;
    const module = await prisma.module.create({
      data: { name }
    });
    res.status(201).json(module);
  } catch (error) {
    console.error('Create module error:', error);
    res.status(500).json({ message: 'Failed to create module' });
  }
});

app.put('/modules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const module = await prisma.module.update({
      where: { id },
      data: req.body
    });
    res.json(module);
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({ message: 'Failed to update module' });
  }
});

app.delete('/modules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.module.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({ message: 'Failed to delete module' });
  }
});

// Documents CRUD
app.get('/documents', async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      include: {
        moduleDocuments: {
          include: {
            module: true
          }
        }
      }
    });
    res.json(documents);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
});

app.post('/documents', async (req, res) => {
  try {
    const { name, path } = req.body;
    const document = await prisma.document.create({
      data: { name, path }
    });
    res.status(201).json(document);
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ message: 'Failed to create document' });
  }
});

app.put('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const document = await prisma.document.update({
      where: { id },
      data: req.body
    });
    res.json(document);
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ message: 'Failed to update document' });
  }
});

app.delete('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.document.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Failed to delete document' });
  }
});

// Module-Document mappings
app.post('/module-documents', async (req, res) => {
  try {
    const { moduleId, documentId } = req.body;
    const moduleDocument = await prisma.moduleDocument.create({
      data: { moduleId, documentId },
      include: {
        module: true,
        document: true
      }
    });
    res.status(201).json(moduleDocument);
  } catch (error) {
    console.error('Create module-document mapping error:', error);
    res.status(500).json({ message: 'Failed to create module-document mapping' });
  }
});

app.delete('/module-documents/:moduleId/:documentId', async (req, res) => {
  try {
    const { moduleId, documentId } = req.params;
    await prisma.moduleDocument.delete({
      where: {
        moduleId_documentId: {
          moduleId,
          documentId
        }
      }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Delete module-document mapping error:', error);
    res.status(500).json({ message: 'Failed to delete module-document mapping' });
  }
});

app.get('/module-documents/:moduleId', async (req, res) => {
  try {
    const { moduleId } = req.params;
    const moduleDocuments = await prisma.moduleDocument.findMany({
      where: { moduleId },
      include: { document: true }
    });
    res.json(moduleDocuments.map(md => md.document));
  } catch (error) {
    console.error('Get module documents error:', error);
    res.status(500).json({ message: 'Failed to fetch module documents' });
  }
});

app.get('/health', (req, res) => {
  res.json({ service: 'doc-service', status: 'healthy', port: PORT });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`📦 Doc Service running on port ${PORT}`);
  });
}

module.exports = app;