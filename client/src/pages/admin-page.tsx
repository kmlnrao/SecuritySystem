import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Shield, Puzzle, FileText, Settings, Activity, Database, Link } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { UserManagementTable } from "@/components/user-management-table";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

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

  const activeUsers = users.filter((user: any) => user.isActive);
  const inactiveUsers = users.filter((user: any) => !user.isActive);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Administration</h2>
          <p className="text-muted-foreground">Manage users, roles, modules, and system configuration</p>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeUsers.length} active, {inactiveUsers.length} inactive
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">
              {roles.filter((role: any) => role.isActive).length} active roles
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hospital Modules</CardTitle>
            <Puzzle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modules.length}</div>
            <p className="text-xs text-muted-foreground">
              {modules.filter((module: any) => module.isActive).length} active modules
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">
              {documents.filter((doc: any) => doc.isActive).length} active documents
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Role Management
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Puzzle className="h-4 w-4" />
            Module Management
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Document Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">User Management</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
          <UserManagementTable />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Role Management</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
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
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Module Management</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Module
            </Button>
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
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Document Management</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Document
            </Button>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}