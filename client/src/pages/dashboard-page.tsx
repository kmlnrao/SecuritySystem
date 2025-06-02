import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/sidebar";
import { DashboardStats } from "@/components/dashboard-stats";
import { QuickActionsPanel } from "@/components/quick-actions-panel";
import { UserManagementTable } from "@/components/user-management-table";
import { PermissionManagementTable } from "@/components/permission-management-table";
import { AddUserDialog, EditUserDialog, ViewUserDialog } from "@/components/user-dialogs";
import { AddRoleDialog, EditRoleDialog, ViewRoleDialog } from "@/components/role-dialogs";
import { AddModuleDialog, EditModuleDialog, ViewModuleDialog } from "@/components/module-dialogs";
import { AddDocumentDialog, EditDocumentDialog, ViewDocumentDialog } from "@/components/document-dialogs";
import { AddPermissionDialog, ViewPermissionDialog } from "@/components/permission-dialogs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Users, Shield, Puzzle, FileText, Settings, Activity, Database, Link, Bell, Edit, Eye, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

type ViewType = 'dashboard' | 'users' | 'roles' | 'modules' | 'documents' | 'permissions' | 'system';

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addRoleOpen, setAddRoleOpen] = useState(false);
  const [editRoleOpen, setEditRoleOpen] = useState(false);
  const [viewRoleOpen, setViewRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [addModuleOpen, setAddModuleOpen] = useState(false);
  const [editModuleOpen, setEditModuleOpen] = useState(false);
  const [viewModuleOpen, setViewModuleOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [addDocumentOpen, setAddDocumentOpen] = useState(false);
  const [editDocumentOpen, setEditDocumentOpen] = useState(false);
  const [viewDocumentOpen, setViewDocumentOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [addPermissionOpen, setAddPermissionOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Role deletion mutation
  const deleteRoleMutation = useMutation({
    mutationFn: async (roleId: string) => {
      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete role');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Role handlers
  const handleEditRole = (role: any) => {
    setSelectedRole(role);
    setEditRoleOpen(true);
  };

  const handleViewRole = (role: any) => {
    setSelectedRole(role);
    setViewRoleOpen(true);
  };

  const handleDeleteRole = (roleId: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      deleteRoleMutation.mutate(roleId);
    }
  };

  // Module deletion mutation
  const deleteModuleMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete module');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      toast({
        title: "Success",
        description: "Module deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Module handlers
  const handleEditModule = (module: any) => {
    setSelectedModule(module);
    setEditModuleOpen(true);
  };

  const handleViewModule = (module: any) => {
    setSelectedModule(module);
    setViewModuleOpen(true);
  };

  const handleDeleteModule = (moduleId: string) => {
    if (confirm("Are you sure you want to delete this module?")) {
      deleteModuleMutation.mutate(moduleId);
    }
  };

  // Document deletion mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete document');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Document handlers
  const handleEditDocument = (document: any) => {
    setSelectedDocument(document);
    setEditDocumentOpen(true);
  };

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document);
    setViewDocumentOpen(true);
  };

  const handleDeleteDocument = (documentId: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      deleteDocumentMutation.mutate(documentId);
    }
  };

  // Fetch all data
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error(`Users fetch failed: ${response.status}`);
        return await response.json() || [];
      } catch (error) {
        console.error('Users fetch error:', error);
        return [];
      }
    }
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      try {
        const response = await fetch('/api/roles', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error(`Roles fetch failed: ${response.status}`);
        return await response.json() || [];
      } catch (error) {
        console.error('Roles fetch error:', error);
        return [];
      }
    }
  });

  const { data: modules = [] } = useQuery({
    queryKey: ["modules"],
    queryFn: async () => {
      try {
        const response = await fetch('/api/modules', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error(`Modules fetch failed: ${response.status}`);
        return await response.json() || [];
      } catch (error) {
        console.error('Modules fetch error:', error);
        return [];
      }
    }
  });

  const { data: documents = [] } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      try {
        const response = await fetch('/api/documents', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error(`Documents fetch failed: ${response.status}`);
        return await response.json() || [];
      } catch (error) {
        console.error('Documents fetch error:', error);
        return [];
      }
    }
  });

  // Expose setCurrentView to global scope so sidebar can use it
  (window as any).setDashboardView = setCurrentView;

  const renderContent = () => {
    switch (currentView) {
      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                <p className="text-muted-foreground">Manage hospital staff and user accounts</p>
              </div>
              <Button onClick={() => setAddUserOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
            
            {/* User Statistics */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">All registered users</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.filter((user: any) => user.isActive).length}</div>
                  <p className="text-xs text-muted-foreground">Currently active accounts</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.filter((user: any) => !user.isActive).length}</div>
                  <p className="text-xs text-muted-foreground">Disabled accounts</p>
                </CardContent>
              </Card>
            </div>
            
            <UserManagementTable />
          </div>
        );

      case 'roles':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Role Management</h2>
                <p className="text-muted-foreground">Manage user roles and permissions</p>
              </div>
              <Button onClick={() => setAddRoleOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{roles.length}</div>
                  <p className="text-xs text-muted-foreground">Defined user roles</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{roles.filter((role: any) => role.isActive).length}</div>
                  <p className="text-xs text-muted-foreground">Currently active roles</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Roles</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{roles.filter((role: any) => role.name.includes('Admin')).length}</div>
                  <p className="text-xs text-muted-foreground">Administrative roles</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role: any) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.description || 'No description'}</TableCell>
                        <TableCell>
                          <Badge variant={role.isActive ? "default" : "secondary"}>
                            {role.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-accent hover:text-blue-600"
                              onClick={() => handleEditRole(role)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-slate-400 hover:text-slate-600"
                              onClick={() => handleViewRole(role)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-400 hover:text-red-600"
                              onClick={() => handleDeleteRole(role.id)}
                              disabled={deleteRoleMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case 'modules':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Module Management</h2>
                <p className="text-muted-foreground">Manage hospital departments and modules</p>
              </div>
              <Button onClick={() => setAddModuleOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Module
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
                  <Puzzle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{modules.length}</div>
                  <p className="text-xs text-muted-foreground">Hospital departments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Modules</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{modules.filter((module: any) => module.isActive).length}</div>
                  <p className="text-xs text-muted-foreground">Currently enabled</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Patient Care</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{modules.filter((module: any) => module.name.includes('Patient') || module.name.includes('Medical')).length}</div>
                  <p className="text-xs text-muted-foreground">Patient care modules</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modules.map((module: any) => (
                      <TableRow key={module.id}>
                        <TableCell className="font-medium">{module.name}</TableCell>
                        <TableCell>{module.description || 'No description'}</TableCell>
                        <TableCell>
                          <Badge variant={module.isActive ? "default" : "secondary"}>
                            {module.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(module.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-accent hover:text-blue-600"
                              onClick={() => handleEditModule(module)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-slate-400 hover:text-slate-600"
                              onClick={() => handleViewModule(module)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-400 hover:text-red-600"
                              onClick={() => handleDeleteModule(module.id)}
                              disabled={deleteModuleMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Document Management</h2>
                <p className="text-muted-foreground">Manage system documents and screens</p>
              </div>
              <Button onClick={() => setAddDocumentOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Document
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{documents.length}</div>
                  <p className="text-xs text-muted-foreground">System documents</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Documents</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{documents.filter((doc: any) => doc.isActive).length}</div>
                  <p className="text-xs text-muted-foreground">Currently enabled</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Patient Docs</CardTitle>
                  <Link className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{documents.filter((doc: any) => doc.name.includes('Patient')).length}</div>
                  <p className="text-xs text-muted-foreground">Patient-related</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((document: any) => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">{document.name}</TableCell>
                        <TableCell className="font-mono text-sm">{document.path}</TableCell>
                        <TableCell>{document.type || 'Screen'}</TableCell>
                        <TableCell>
                          <Badge variant={document.isActive ? "default" : "secondary"}>
                            {document.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(document.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-accent hover:text-blue-600"
                              onClick={() => handleEditDocument(document)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-slate-400 hover:text-slate-600"
                              onClick={() => handleViewDocument(document)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-400 hover:text-red-600"
                              onClick={() => handleDeleteDocument(document.id)}
                              disabled={deleteDocumentMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case 'permissions':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Permission Management</h2>
                <p className="text-muted-foreground">Manage user and role permissions for documents</p>
              </div>
              <Button onClick={() => setAddPermissionOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Permission
              </Button>
            </div>
            <PermissionManagementTable />
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Hospital Dashboard</h2>
            </div>
            <DashboardStats />
            <QuickActionsPanel />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center space-x-2 text-sm text-slate-500">
                <span>Dashboard</span>
                <span className="text-xs">/</span>
                <span className="text-slate-900 font-medium">
                  {currentView === 'dashboard' ? 'Overview' : 
                   currentView === 'users' ? 'User Management' :
                   currentView === 'roles' ? 'Role Management' :
                   currentView === 'modules' ? 'Module Management' :
                   currentView === 'documents' ? 'Document Management' :
                   currentView === 'permissions' ? 'Permission Management' :
                   'System Administration'}
                </span>
              </nav>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                {currentView === 'dashboard' ? 'Hospital Dashboard' : 
                 currentView === 'users' ? 'User Management' :
                 currentView === 'roles' ? 'Role Management' :
                 currentView === 'modules' ? 'Module Management' :
                 currentView === 'documents' ? 'Document Management' :
                 'System Administration'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-600">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* User Management Dialogs */}
      <AddUserDialog open={addUserOpen} onOpenChange={setAddUserOpen} />

      {/* Role Management Dialogs */}
      <AddRoleDialog open={addRoleOpen} onOpenChange={setAddRoleOpen} />
      <EditRoleDialog 
        role={selectedRole} 
        open={editRoleOpen} 
        onOpenChange={setEditRoleOpen} 
      />
      <ViewRoleDialog 
        role={selectedRole} 
        open={viewRoleOpen} 
        onOpenChange={setViewRoleOpen} 
      />

      {/* Module Management Dialogs */}
      <AddModuleDialog open={addModuleOpen} onOpenChange={setAddModuleOpen} />
      <EditModuleDialog 
        module={selectedModule} 
        open={editModuleOpen} 
        onOpenChange={setEditModuleOpen} 
      />
      <ViewModuleDialog 
        module={selectedModule} 
        open={viewModuleOpen} 
        onOpenChange={setViewModuleOpen} 
      />

      {/* Document Management Dialogs */}
      <AddDocumentDialog open={addDocumentOpen} onOpenChange={setAddDocumentOpen} />
      <EditDocumentDialog 
        document={selectedDocument} 
        open={editDocumentOpen} 
        onOpenChange={setEditDocumentOpen} 
      />
      <ViewDocumentDialog 
        document={selectedDocument} 
        open={viewDocumentOpen} 
        onOpenChange={setViewDocumentOpen} 
      />

      {/* Permission Management Dialogs */}
      <AddPermissionDialog open={addPermissionOpen} onOpenChange={setAddPermissionOpen} />
    </div>
  );
}