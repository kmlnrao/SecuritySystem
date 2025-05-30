import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DashboardStats } from "@/components/dashboard-stats";
import { QuickActionsPanel } from "@/components/quick-actions-panel";
import { UserManagementTable } from "@/components/user-management-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Users, Shield, Puzzle, FileText, Settings, Activity, Database, Link } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type ViewType = 'dashboard' | 'users' | 'roles' | 'modules' | 'documents' | 'system';

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const { user } = useAuth();

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
              <Button>
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
              <Button>
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
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm">Permissions</Button>
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
                <p className="text-muted-foreground">Configure hospital departments and modules</p>
              </div>
              <Button>
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
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm">Documents</Button>
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
                <p className="text-muted-foreground">Manage document and screen mappings</p>
              </div>
              <Button>
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
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm">Modules</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
    <div className="flex-1 p-8 pt-6">
      {renderContent()}
    </div>
  );
}