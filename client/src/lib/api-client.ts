import axios from 'axios';

// Create axios instances for each microservice
const createApiClient = (baseURL: string) => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor to include JWT token
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle auth errors
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/auth';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Main server API client (all services consolidated)
export const authApi = createApiClient('http://localhost:5000/api');
export const userApi = createApiClient('http://localhost:5000/api');
export const docApi = createApiClient('http://localhost:5000/api');
export const permApi = createApiClient('http://localhost:5000/api');

// API service functions
export const userService = {
  getUsers: () => userApi.get('/users'),
  createUser: (userData: any) => userApi.post('/users', userData),
  updateUser: (id: string, userData: any) => userApi.put(`/users/${id}`, userData),
  deleteUser: (id: string) => userApi.delete(`/users/${id}`),
  
  getRoles: () => userApi.get('/roles'),
  createRole: (roleData: any) => userApi.post('/roles', roleData),
  updateRole: (id: string, roleData: any) => userApi.put(`/roles/${id}`, roleData),
  deleteRole: (id: string) => userApi.delete(`/roles/${id}`),
  
  assignRole: (userId: string, roleId: string) => userApi.post('/user-roles', { userId, roleId }),
  removeRole: (userId: string, roleId: string) => userApi.delete(`/user-roles/${userId}/${roleId}`),
  getUserRoles: (userId: string) => userApi.get(`/users/${userId}/roles`),
};

export const documentService = {
  getModules: () => docApi.get('/modules'),
  createModule: (moduleData: any) => docApi.post('/modules', moduleData),
  updateModule: (id: string, moduleData: any) => docApi.put(`/modules/${id}`, moduleData),
  deleteModule: (id: string) => docApi.delete(`/modules/${id}`),
  
  getDocuments: () => docApi.get('/documents'),
  createDocument: (documentData: any) => docApi.post('/documents', documentData),
  updateDocument: (id: string, documentData: any) => docApi.put(`/documents/${id}`, documentData),
  deleteDocument: (id: string) => docApi.delete(`/documents/${id}`),
  
  assignModuleDocument: (moduleId: string, documentId: string) => 
    docApi.post('/module-documents', { moduleId, documentId }),
  removeModuleDocument: (moduleId: string, documentId: string) => 
    docApi.delete(`/module-documents/${moduleId}/${documentId}`),
  getModuleDocuments: (moduleId: string) => docApi.get(`/module-documents/${moduleId}`),
};

export const permissionService = {
  getPermissions: () => permApi.get('/permissions'),
  createPermission: (permissionData: any) => permApi.post('/permissions', permissionData),
  updatePermission: (id: string, permissionData: any) => permApi.put(`/permissions/${id}`, permissionData),
  deletePermission: (id: string) => permApi.delete(`/permissions/${id}`),
  
  getUserPermissions: (userId: string) => permApi.get(`/users/${userId}/permissions`),
  getRolePermissions: (roleId: string) => permApi.get(`/roles/${roleId}/permissions`),
  getUserNavigation: (userId: string) => authApi.get(`/users/${userId}/navigation`),
  checkPermission: (userId: string, documentId: string, action: string) => 
    permApi.get(`/users/${userId}/permissions/${documentId}/${action}`),
};